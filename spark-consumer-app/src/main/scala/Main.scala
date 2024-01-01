import org.apache.log4j.BasicConfigurator
import org.apache.log4j.varia.NullAppender
import org.apache.spark.sql.{DataFrame,  SparkSession}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types.{ IntegerType, LongType, StringType, StructField, StructType}

object Main {

  private object Configs {
    val mongodbUri: String = "mongodb://127.0.0.1:27017"
    val kafkaServer = "localhost:9092"
    val topicSubscribed = "tweets-topic"
    val topicPublished = "top-users-tweets-topic"
    val databaseName = "big-data"
    val collectionName = "tweets"
  }

  val schema: StructType = StructType(
    Array(
      StructField("id", LongType, nullable = true),
      StructField("date", StringType, nullable = true),
      StructField("user", StringType,nullable = true),
      StructField("text", StringType, nullable = true),
      StructField("retweets", IntegerType, nullable = true)
    )
  )

  def main(args: Array[String]): Unit = {
    BasicConfigurator.configure(new NullAppender)

    val spark = createSparkSession()
    import spark.implicits._

    var dataBaseDf = readFromMongoDb(spark, Configs.databaseName, Configs.collectionName).select($"id",$"date",$"user",$"text",$"retweets")

    spark.conf.set("spark.sql.shuffle.partitions", "2")

    val dfFromStream = getDataFrameFromStream(spark)

    val query = dfFromStream.writeStream.foreachBatch { (batchDF: DataFrame, _: Long) =>

      writeToMongoDb(batchDF, Configs.databaseName, Configs.collectionName)

      //make statistics on data and send it to kafka and save it in dataBaseDf that contain all data
      dataBaseDf=statisticsOperationAndSendToKafka(dataBaseDf,batchDF)

      batchDF.show()

    }.start()

    query.awaitTermination()


  }

  /*
    this function is main function in program
    it do this :
    1-make the required statistics on already read data (get most 20 users make that makes tweets)
    2-send it to another topic in kafka to use it in backend later
   */

  private def statisticsOperationAndSendToKafka(dataBaseDf:DataFrame,newData: DataFrame): DataFrame = {
    // Union operation with newData
    val updatedDataBaseDf = dataBaseDf.union(newData)

    // Early return if the DataFrame is empty
    if (updatedDataBaseDf.count() == 0) {
      return updatedDataBaseDf
    }

    val statsDf = aggregateData(updatedDataBaseDf)

    // Convert whole dataFrame to one row of json format
    val aggregatedDF = convertDataFrameForKafka(statsDf)

    statsDf.show()

    // Send data statistics to Kafka
    produceToKafka(aggregatedDF, Configs.topicPublished)
    
    updatedDataBaseDf
  }

  private def createSparkSession(): SparkSession = {
    SparkSession
      .builder
      .appName("final-project")
      .config("spark.mongodb.write.connection.uri", Configs.mongodbUri)
      .config("spark.mongodb.read.connection.uri", Configs.mongodbUri)
      .master("local[8]")
      .getOrCreate()
  }

  private def getDataFrameFromStream(spark: SparkSession): DataFrame = {
    import spark.implicits._

    val df = spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", Configs.kafkaServer)
      .option("subscribe", Configs.topicSubscribed)
      .load()

    //convert data that come from stream from json format to df with structure of provided schema
    val dfWithTimestamp = df.selectExpr("CAST(value AS STRING) as json")
      .select(from_json($"json", schema).as("data"))
      .select("data.*")

    //convert date from string format to date object in dataframe
    val dfWithDate = dfWithTimestamp.withColumn("date",to_timestamp($"date", "yyyy-MM-dd'T'HH:mm:ss"))

    dfWithDate
  }

  // write data to specific database and specific collection
  private def writeToMongoDb(dataFrame: DataFrame, databaseName: String, collectionName: String): Unit = {
    dataFrame.write
      .format("mongodb")
      .mode("append")
      .option("database", databaseName)
      .option("collection", collectionName)
      .save()
  }
  // read data from specific database and specific collection
  private def readFromMongoDb(spark: SparkSession, databaseName: String, collectionName: String): DataFrame = {
    spark.read.format("mongodb")
      .option("database", databaseName)
      .option("collection", collectionName)
      .load()
  }

  //send to specific topic a specific dataframe
  private def produceToKafka(dataFrame: DataFrame, topicName: String): Unit = {
    dataFrame.write
      .format("kafka")
      .option("kafka.bootstrap.servers", Configs.kafkaServer)
      .option("topic", topicName)
      .save()
  }
  //convert whole dataframe to one JSON string
  private def convertDataFrameForKafka(dataFrame: DataFrame): DataFrame = {
    /*
      struct all columns in one column (each row contain struct {col1val,col2val,..})
      then make collect all rows in one row contain list of struct then convert this row to json format
    */
    dataFrame
      .agg(collect_list(struct(col("*"))).as("data"))
      .select(to_json(col("data")).as("value"))
  }

  //get most 20 users that makes tweets
  private def aggregateData(dataFrame: DataFrame): DataFrame = {
    dataFrame.groupBy(col("user")).count().sort(col("count").desc).limit(20)
  }
  
}