angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("partials/about.html","<div class=\"centered\"><!-- paragraph about BNNTs --><div class=\"paragraph\">Boron nitride nanotubes are a revolutionary material with unique multifunctional properties and great commercial potential. BNNTs have a structure similar to their well-known carbon nanotube (CNT) counterparts, but with alternating boron and nitrogen atoms self-assembling into a nanoscale tube whose diameter may range from 1 to 20nm and whose length may vary from 50 to 1000 microns. Due to their similar structure, BNNTs have the same phenomenal mechanical properties associated with CNTs, particularly their incredible mechanical strength and ability to be integrated into almost any shape.  However, BNNTs offer additional, superior properties and characteristics when compared with CNTs, most notably:<br><br><!-- ordered list of characteristics --><ol class=\"characteristicsList\"><li>Much higher self-friction than CNTs, with the expectation of yielding much stronger yarns</li><li>Maintain structural stability at temperatures up to 900°C in air, whereas CNTs are unstable above 400°C</li><li>Relatively inert to most acids and alkalis</li><li>Semiconducting properties which are sensitive to doping</li><li>Thermal transfer properties similar to CNTs (~1000 watts/m×K) but with insulating characteristics</li><li>Radiation absorption and shielding properties provided by boron atoms in the structure</li><li>Piezoelectric characteristics</li><li>Luminescence</li><li>Easy incorporation into matrices of a wide variety of other materials, including ceramics, polymers and metals</li><li>Experimental Data showing them to be non-toxic due to their chemical and structural stability</li></ol></div></div>");
$templateCache.put("partials/careers.html","<div class=\"centered\"><p>American Boronite Corporation (“Boronite”) is an advanced materials company manufacturing Boron Nitride Nanotube continuous yarns and tapes. These materials have the potential to have significant impact on a wide range of industries from energy to advanced structures.</p><p>We are seeking a hands-on motivated, talented and ambitious multidisciplinary design engineer to help in the detailed design, optimization, and operation of our state-of-the-art nanotube production equipment. In this position you will:</p><ul><li>Provide modeling support in the design of fluid flow models of parts of our process.</li><li>Provide modeling support in the design of textile hardware for handling and post-processing of yarns and tapes.</li><li>Assist in the overall design and operation of tape and yarn production systems.</li><li>Assist in the development of the instrumentation required to automate the process equipment and in the design and fabrication of supporting systems.</li><li>Work with Boronite’s other engineers and materials scientists to develop and characterize properties.</li><li>Articulate your designs and present results to the board of technical advisors and to the research group and potentially at public meetings.</li><li>Contribute to proposals.</li><li>Potentially provide supervision to one or more junior engineers or technicians.</li></ul><p>Qualified candidates have a bachelor’s or master’s degree in mechanical engineering or a related discipline, work well with others, and have close familiarity with SolidWorks, Ansys, or with other fluid modeling systems such as OpenFOAM. Experience with chemical engineering process development and with nanomaterials is a plus.</p><p>Boronite offers a competitive salary and generous equity incentives for its employees.</p><p>Interested candidates should submit a cover letter, a CV and names and contact information for three references to Nancy.Brothers@boronite.com. This position is open only to US Citizens.</p></div>");
$templateCache.put("partials/contact.html","<div class=\"centered\"><iframe class=\"googleMap\" src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5886.008540908612!2d-71.21650259081149!3d42.47019785948172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e39e148d0a9249%3A0x2842971d3cafe8a3!2s11+Cypress+Dr%2C+Burlington%2C+MA+01803!5e0!3m2!1sen!2sus!4v1452389098889\" width=\"350\" height=\"280\" frameborder=\"0\" style=\"border:0\" allowfullscreen></iframe><form novalidate name=\"form\"><div class=\"contactUsInput\"><label>Name</label><input required type=\"text\" ng-model=\"form.name\" placeholder=\"Full name\"></div><div class=\"contactUsInput\"><label>Affiliation (optional)</label><input type=\"text\" placeholder=\"Company, organization...\" ng-model=\"form.company\"></div><div class=\"contactUsInput\"><label>Email</label><input required type=\"email\" placeholder=\"Email address\" ng-model=\"form.email\"></div><div class=\"contactUsInput\"><label>Phone Number</label><input required type=\"text\" placeholder=\"Phone number\" ng-model=\"form.phoneNumber\" ng-pattern=\"/^[0-9\\-\\(\\)\\.]{10,}$/\"><!-- ng-pattern=\"/^[0-9\\-\\(\\)]{10,}$/\"/ --></div><label>Message</label><textarea required ng-model=\"form.message\" placeholder=\"Enter your message here...\"></textarea><br><br><hidden id=\"myRecaptcha\"></hidden><!-- <div class=\"g-recaptcha\" data-sitekey=\"6LfM6xQTAAAAAJRd4Ne72ny29AwzWLe40JGqSdQ8\"></div> --><br><input type=\"submit\" value=\"SUBMIT\" ng-disabled=\"form.$invalid\" ng-click=\"submit()\"><!-- todo --></form></div>");
$templateCache.put("partials/home.html","<div class=\"honeycombImages fadeIn\" ng-show=\"showImages\"><img style=\"position: absolute\" ng-repeat=\"hex in imgHexes\" ng-attr-src=\"{{hex.url}}\" ng-style=\"{top: hex.pos.y + \'px\', left: hex.pos.x - 30 + \'px\', width: imgWidth + \'px\', height: imgHeight + \'px\'}\"></div><svg width=\"100%\" height=\"219px\" style=\"border: 1px solid black\"><g ng-if=\"showImages\"><path ng-repeat=\"path in maskHexes\" d=\"\" ng-attr-d=\"{{path.string}}\" fill=\"white\"></path><path class=\"honeycombImageHex\" ng-repeat=\"hex in imgHexes\" d=\"\" ng-attr-d=\"{{hex.path.string}}\" fill=\"black\" fill-opacity=\"0\" stroke=\"black\" stroke-width=\"1\" ng-click=\"clickedHex(hex)\"></path></g><g style=\"{{lineStyle}}\" stroke=\"grey\" stroke-width=\"1\" ng-attr-transform=\"{{transform}}\"><path ng-repeat=\"path in dashedLines\" d=\"\" ng-attr-d=\"{{path.string}}\" style=\"stroke: {{path.stroke}}\"></path></g><br><br></svg><div class=\"centered\"><img src=\"images/home-logo.png\" class=\"logo\"><p class=\"paragraph\"><strong>American Boronite Corporation</strong> is an advanced materials company manufacturing Boron Nitride Nanotubes (BNNTs) in continuous <strong>yarn</strong> and <strong>seamless tape</strong> formats. We are focused not only on being the first in the world to synthesize BNNTs in continuous form, but also on building industrial-scale manufacturing capabilities. We have developed a proprietary, patent pending, scalable technology, with appropriate quality control and manufacturing systems. Our immediate goal is the commercial development of BNNT yarn and tape for academic study, application development, and commercial sales. Our focus is to become the globally preeminent supplier of BNNT yarn and tape, and developer and licensor of BNNT applications in a wide variety of fields.</p></div><div class=\"homeImagePopup fadeInFast\" ng-if=\"selectedImage\"><img class=\"homeImagePopupContent\" ng-attr-src=\"{{selectedImage}}\"></div>");
$templateCache.put("partials/ourTeam.html","our team content");
$templateCache.put("partials/test.html","<!DOCTYPE html><html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><title>CSSReset.com - Demo - How To Keep Footer At Bottom of Page</title><link rel=\"shortcut icon\" href=\"http://www.cssreset.com/favicon.png\"><link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\"><!--[if lt IE 7]>\r\n    <style type=\"text/css\">\r\n        #wrapper { height:100%; }\r\n    </style>\r\n    <![endif]--><!-- Demo-specific (unnecessary) --><script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js\" type=\"text/javascript\"></script><script type=\"text/javascript\">jQuery(document).ready(function($) {\r\n			var yay = 0, text = $(\'#content\').find(\'.blah\').text();\r\n			$(\'#add-content\').click(function() {\r\n				if ( !yay ) {\r\n					$(\'#content\').find(\'.box\').append(\'<h2>Yay!</h2>\');\r\n					yay = 1;\r\n				}\r\n				$(\'#content\').find(\'.box\').append(\'<p>\'+text+\'</p>\');\r\n			});\r\n		});</script></head><body><div id=\"wrapper\"><div id=\"header\"><div class=\"box\"><h1>And STAY Down! How To Keep Your Footer At The Bottom Of The Page With CSS</h1><p>An original demo and tutorial from CSSReset.com, demonstrating how to keep the footer at the bottom of the page with pure, valid CSS and no tricks and hacks. <strong>Tutorial &raquo;</strong> <a href=\"http://www.cssreset.com/2010/css-tutorials/how-to-keep-footer-at-bottom-of-page-with-css/\" title=\"How To Keep Your Footer At The Bottom Of The Page With CSS\">How To Keep Your Footer At The Bottom Of The Page With CSS</a></p></div><!-- .box --></div><!-- #header --><div id=\"content\"><div class=\"box\"><p><a href=\"http://www.cssreset.com/2010/css-tutorials/how-to-keep-footer-at-bottom-of-page-with-css/\" title=\"Back to: How To Keep Your Footer At The Bottom Of The Page With CSS\"><small>&laquo; Back to tutorial</small></a></p><h2>This is your content</h2><p>Try resizing the window, or adding some more content with the button below, to see how the footer is affected.</p><p><a id=\"add-content\" class=\"large left orange button\" href=\"#\" title=\"Add More Content\">Add More Content &raquo;</a> <a class=\"large right blue button\" href=\"http://www.cssreset.com/demos/layouts/how-to-keep-footer-at-bottom-of-page-with-css/CSSReset.com - Keeping Footer At The Bottom Of The Page.zip\" title=\"Download Source\">Download Source Code &raquo;</a></p><div class=\"clear\"></div><p class=\"blah\">Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.</p></div><!-- .box --></div><!-- #content --><div id=\"footer\"><div class=\"box\"><h2>This is your tearaway footer</h2><p>It will stick to the bottom of the viewport on short pages, or stretch down on long pages.</p></div><!-- .box --></div><!-- #footer --></div><!-- #wrapper --></body></html>");}]);