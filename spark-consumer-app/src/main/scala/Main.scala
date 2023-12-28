import org.apache.log4j.BasicConfigurator
import org.apache.log4j.varia.NullAppender
import org.apache.spark.sql.{DataFrame, SparkSession}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types.{StringType, StructField, StructType}

object Main {

  private object Configs {
    val mongodbUri: String = "mongodb://127.0.0.1:27017"
    val kafkaServer = "localhost:9092"
    val topicSubscribed = "t1"
    val topicPublished = "t2"
    val databaseName = "zeft"
    val collectionName = "zeft"
  }

  val schema: StructType = StructType(
    Array(
      StructField("id", StringType, nullable = true),
      StructField("date", StringType, nullable = true),
      StructField("user", StringType,nullable = true),
      StructField("text", StringType, nullable = true),
      StructField("retweets", StringType, nullable = true)
    )
  )

  def main(args: Array[String]): Unit = {
    BasicConfigurator.configure(new NullAppender)

    val spark = createSparkSession()

    spark.conf.set("spark.sql.shuffle.partitions", "2")

    val dfFromStream = getDataFrameFromStream(spark)

    val query = dfFromStream.writeStream.foreachBatch { (batchDF: DataFrame, _: Long) =>
      writeToMongoDb(batchDF, Configs.databaseName, Configs.collectionName)

      statisticsOperationAndSendToKafka(spark)

      batchDF.show()
    }.start()

    query.awaitTermination()
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

    df.selectExpr("CAST(value AS STRING) as json")
      .select(from_json($"json", schema).as("data"))
      .select("data.*")
  }

  private def writeToMongoDb(dataFrame: DataFrame, databaseName: String, collectionName: String): Unit = {
    dataFrame.write
      .format("mongodb")
      .mode("append")
      .option("database", databaseName)
      .option("collection", collectionName)
      .save()
  }

  private def readFromMongoDb(spark: SparkSession, databaseName: String, collectionName: String): DataFrame = {
    spark.read.format("mongodb")
      .option("database", databaseName)
      .option("collection", collectionName)
      .load()
  }

  private def statisticsOperationAndSendToKafka(spark: SparkSession): Unit = {
    val dataBaseDf = readFromMongoDb(spark, Configs.databaseName, Configs.collectionName)

    val statsDf = aggregateData(dataBaseDf)

    val aggregatedDF = convertDataFrameForKafka(statsDf)

    statsDf.show()

    produceToKafka(aggregatedDF, Configs.topicPublished)
  }

  private def produceToKafka(dataFrame: DataFrame, topicName: String): Unit = {
    dataFrame.write
      .format("kafka")
      .option("kafka.bootstrap.servers", Configs.kafkaServer)
      .option("topic", topicName)
      .save()
  }

  private def convertDataFrameForKafka(dataFrame: DataFrame): DataFrame = {
    dataFrame
      .agg(collect_list(struct(col("*"))).as("data"))
      .select(to_json(col("data")).as("value"))
  }

  private def aggregateData(dataFrame: DataFrame): DataFrame = {
    dataFrame.groupBy(col("user")).count().sort(col("count").desc).limit(20)
  }
  
}