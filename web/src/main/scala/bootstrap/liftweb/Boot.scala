

package bootstrap.liftweb

import net.liftweb._
import http.{LiftRules, NotFoundAsTemplate, ParsePath, S, Req, JsonResponse}
import sitemap.{SiteMap, Menu, Loc}
import util.{ NamedPF }
import common.{Full}
import net.liftweb.json.JsonDSL._
import hvorlangterdet.lib.Hvorlang



class Boot {
  def boot {
  
  
    // where to search snippet
    LiftRules.addToPackages("hvorlangterdet")

    // build sitemap
    val entries = List(Menu("Home") / "index") :::
                  Nil
    
    LiftRules.uriNotFound.prepend(NamedPF("404handler"){
      case (req,failure) => NotFoundAsTemplate(
        ParsePath(List("exceptions","404"),"html",false,false))
    })
    
    LiftRules.setSiteMap(SiteMap(entries:_*))

    val continuation: LiftRules.DispatchPF = {
      case r@Req("hvorlangt" :: rest, _, _) => {
        S respondAsync {
          val a = (r.param("a[lat]").get, r.param("a[lon]").get)
          val b = (r.param("b[lat]").get, r.param("b[lon]").get)


          Full(JsonResponse(( "distance", Hvorlang(a, b).km )))
        }
      }
    }

    LiftRules.dispatch.append(continuation);

    
    // set character encoding
    LiftRules.early.append(_.setCharacterEncoding("UTF-8"))

  }
}