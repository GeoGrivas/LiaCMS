Welcome to LiaCMS, a bodiless (in contrast to headless) CMS, in other words, a CMS that's back end agnostic!

What is LiaCMS exactly?

Well, it's a drag n drop website builder, built with React and Nextjs. 
It currently powers my personal website at https://adventurouscoding.com/.

Features:
  Page and Layout creation through drag n drop
  Multi layout capable (each page has its own Layout)
  Templating through graphical API to Page mapping
  
LiaCMS is capable of creating anything,from a simple blog to a full fledged e-commerce platform, the only things you need are the components.

How to start:

First of all, you can see a live demo through my personal website.Check out the editor at  https://adventurouscoding.com?edit and login with username : test and password : 1234Aa#

That will give you access to the editor, however you won't be able to save any changes.

In order to setup your own website, you will need a place to store and retrieve the pages, that could anything(a server,Firebase,etc). You can replace the API urls in the /src/EditorRenderer/Requests.js . To see what needs to be stored and retrieved, you can check the classes Page and Layout that are located at /src/EditorRenderer. In order for the login to work you will need to return a token and an expiration date(named token and expiration).

Once you're inside and you're editing, you can drag components from the components list into the canvas. Components may be of type containers so they'll be able to contain other components. If you wish to move a component you can do so by holding the click on it for at least 200ms and then start dragging. 
If you wish to edit/delete ALT+Click on it, also if a component has some kind of event or property that makes it unable to click and drag, you will find a button there that will help you with dragging.
You can switch between Layout editing and Page editing,in Layout editing you create layouts, in Page editing you create pages. When you are editing a Layout, it must contain a Content component cause that's were the Page will be rendered afterwards.


PLEASE NOTE : 
this is a project started by me, at the same time I started learning React as a junior dev. This is by no means a production ready application nor a showcase of my mad skills. It is still under development and hopefully, some day, it will turn into something useful.
