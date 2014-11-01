var switchApp=function(path) {
  process.chdir("../"+path);
  document.location.href= "../"+path+"/index.html";
}

var appmenuclick=function(app) {
  switchApp(app.path);
}

var goHome=function() {
  switchApp("installer");
}

var createMenu=function(apps) {
  if (!(apps && apps.length) )return;
  var gui = nodeRequire('nw.gui');
  var mb = new gui.Menu({type:"menubar"});
  var appsMenu= new gui.Menu();
  var appsItem = new gui.MenuItem({ label: 'Apps' });
  apps.map(function(app) {
    if (app.path=="installer") return;
    appsMenu.append(new gui.MenuItem({ label: app.title, click:appmenuclick.bind(null,app)}));
  });

  appsItem.submenu=appsMenu;
  if (mb.createMacBuiltin) mb.createMacBuiltin("node-webkit");
  mb.append(appsItem);
  var homeItem = new gui.MenuItem({ label: 'Home' ,click:goHome});
  mb.append(homeItem);

  gui.Window.get().menu = mb; 
}
var createAppMenu=function(){
    var apps=JSON.parse(kfs.listApps());
    createMenu(apps);
}

var timer1=setTimeout(function(){
      if (typeof kfs!="undefined") {
            createAppMenu();
            //handle_reopen();
            //console.log("handle reopen")
            clearInterval(timer1);
      }
},200);
/*
var handle_reopen=function() {
  var gui = nodeRequire('nw.gui');
  console.log("REOPEN");
  gui.App.on("reopen", function(){
             appWindow.focus();
             appWindow.focus(); // calling it twice is more reliable. weirdly
  });  
}
*/