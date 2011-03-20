package hvorlangterdet.lib

import no.aslakjo.geolib._

object Hvorlang {
    private def s2d(from:String):Double   = from.toDouble

    def apply(a:Tuple2[String, String], b:Tuple2[String, String]) = {
      val from = Point(s2d(a._2) , s2d(a._1))
      val to =   Point(s2d(b._2) , s2d(b._1))

      println(from)
      println(to)

      from.to(to).distance
    }


}