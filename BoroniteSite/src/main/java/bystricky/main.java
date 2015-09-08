package main.java.bystricky;

import java.util.Map;

import com.google.common.collect.ImmutableMap;

import spark.ModelAndView;
import spark.Request;
import spark.Response;
import spark.Spark;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;

public class main {

  public static void main(String[] args) {
    Spark.setPort(1234);
    Spark.externalStaticFileLocation("src/main/resources/public_html");
    Spark.get("/home", new Setup(), new FreeMarkerEngine());
  }

  /**
   * Sends set-up data to the spark site. No parameters needed.
   *
   * @author filipbys
   */
  private static class Setup implements TemplateViewRoute {

    /**
     * @return a ModelAndView object containing the location of the main ftl
     *         file, and the title.
     */
    @Override
    public ModelAndView handle(Request arg0, Response arg1) {
      Map<String, Object> variables = ImmutableMap.of("title", "workout");
      return new ModelAndView(variables, "index.html");
    }
  }

}
