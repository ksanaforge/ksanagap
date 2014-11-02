var switchApp=function(path) {
  var fs=nodeRequire("fs");
  if (fs.existsSync("../"+path)) {
    process.chdir("../"+path);
    document.location.href= "../"+path+"/index.html";
  }
}

var appmenuclick=function(dbid) {
  switchApp(dbid);
}

var goHome=function() {
  switchApp("installer");
}

var createMenu=function(apps) {
  if (!(apps && apps.length) )return;
  var gui = nodeRequire('nw.gui');
  var mb = new gui.Menu({type:"menubar"});
  var appsMenu= new gui.Menu();
  var appsItem = new gui.MenuItem({ label: 'Database' });

  apps.map(function(app) {
    if (app.path=="installer") return;
    appsMenu.append(new gui.MenuItem({ label: app.title, click:appmenuclick.bind(null,app.path)}));
  });

  appsMenu.append( new gui.MenuItem({ type: 'separator' }));  
  appsMenu.append(new gui.MenuItem({ label: "Home", click:appmenuclick.bind(null,"installer")}));

  appsItem.submenu=appsMenu;
  if (mb.createMacBuiltin) mb.createMacBuiltin("node-webkit");
  mb.append(appsItem);

  var downloadItem = new gui.MenuItem({ label: 'Get Accelon Database' ,click:goAccelonWebsite});
  mb.append(downloadItem);

  gui.Window.get().menu = mb; 
}
var createAppMenu=function(){
    var apps=JSON.parse(kfs.listApps());
    createMenu(apps);
}

var timer1=setTimeout(function(){
      if (typeof kfs!="undefined") {
            createAppMenu();
            clearInterval(timer1);
      }
},200);

var goAccelonWebsite=function() {
  var gui = nodeRequire('nw.gui'); 
  gui.Shell.openExternal('http://accelon.github.io'); 
};

