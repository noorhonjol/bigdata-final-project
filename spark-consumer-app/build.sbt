ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "2.12.0"
libraryDependencies += "org.apache.spark" %% "spark-sql" % "3.2.0"
libraryDependencies += "org.apache.spark" %% "spark-core" % "3.2.0"
libraryDependencies += "org.apache.spark" %% "spark-streaming" % "3.2.0"
libraryDependencies += "org.apache.spark" %% "spark-sql-kafka-0-10" % "3.2.0"
libraryDependencies += "org.mongodb.spark" %% "mongo-spark-connector" % "10.2.0"

lazy val root = (project in file("."))
  .settings(
    name := "untitled1"
  )
