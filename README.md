<h2>WebTop - A Web based desktop environment</h2>
WebTop is meant to be a simulated desktop with various functions that might be useful to web developers and designers of different kinds. At first the environment will have a limited amount of applications, these are more there to be placeholders under the development of the core library.
Later I will try to make some sort of API for the environment, making it possible for other developers to make applications for the WebTop.
A big goal is to let the Portals become a general purpose container for applications written in JavaScript/HTML5, this might be extended to work with other web languages such as PHP and Ruby depending on what webservice I put it up on.
When the project gets further I might even release it to the public and put it under some funky open source license.

<h3>Desktop</h3>
The desktop module is the base of WebTop, the desktop keeps track of all applications and portals that are active within the environment and handles general settings.
When I get further into the development of webtop I might make a PHP based back office that allows people to login to their own webtop and install applications and setup their own custom styles.
It would be cool to have some sort of chat/forum/community functionality embedded in this system, which would be possible if I made a PHP backbone that keeps communication with the server and database.

<h3>Portals</h3>
The portals are containers for applications that will be run in WebTop. these can be customized through different parameters so that they act as the user wants them. Portals are direct childeren of the Desktop module, so all the active portals will be accesible through the Desktop object.

<h3>Applications</h3>
Applications will run inside portals as they are the containers. They will also reside as objects in the Desktop object so that the desktop can keep track of all the active applications!
I will try to make a good framework for these to run on, I want WebTop to be able to use both homemade applications and general HTML5 applications, and make the implementation as easy as possible.
Here's a list of probable applications that might see the light of the day inside WebTop.
<ul>
<li>Gradient Edit - In development</li>
<li>WtPixel</li>
<li>WtEdit</li>
<li>Wt WebGL Studio</li>
<li>WtImage</li>
<li>WtFile</li>
</ul>

<h3>CGL</h3>
I want to develop CGL in tandem with WebTop, in essence I want CGL titles to run smooth under the WebTop environment. to do this I will need to make a good system so that the Desktop can keep track on which application to give priority and freeze the others. Need to keep performance levels as high as possible.

<h3>Documentation, Production and API</h3>
Right now it looks like I will go for the YUI package of documentation and production deployment tools (YUI Compressor and YUIDocs). I will try to comment the code in a good mather to give the library a good API to work with if external developers decide to write apps to WebTop or port their already written HTML5 applications.

<h3>Ajax</h3>
WebTop needs a stable and robust Ajax library to work with the PHP backend when it comes to that part of the development, this can be a great opertunity to get into the nuts and bolts of Ajax development!