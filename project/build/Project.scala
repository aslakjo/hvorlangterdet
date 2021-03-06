

import sbt._

class Hvorlangterdet(info:ProjectInfo) extends ParentProject(info){
  val geolib = project("sub" / "geolib")
  val web = project("web", "Web", new LiftProject(_), geolib )


  class LiftProject(info: ProjectInfo) extends DefaultWebProject(info) with stax.StaxPlugin  {
    val scalatoolsRelease = "Scala Tools Snapshot" at
    "http://scala-tools.org/repo-releases/"

    val liftVersion = "2.2-RC4"

    override def staxApplicationId = "hvorlangterdet"
    override def staxUsername = "aslakjo"


    override def libraryDependencies = Set(
      "net.liftweb" %% "lift-webkit" % liftVersion % "compile->default",
      "net.liftweb" %% "lift-testkit" % liftVersion % "compile->default",
      "org.mortbay.jetty" % "jetty" % "6.1.22" % "test->default",
      "ch.qos.logback" % "logback-classic" % "0.9.26",
      "junit" % "junit" % "4.5" % "test->default",
      "org.scala-tools.testing" %% "specs" % "1.6.6" % "test->default"
    ) ++ super.libraryDependencies
  }

}

