//RENDERIZAR MEDIANTE CONSOLA
//http://help.adobe.com/en_US/AfterEffects/9.0/WS8A8CD670-4A72-4fb5-AE8E-CB9E232EC0B5a.html

//validar que el archivo de texto exista
//validar que el logo exista
//validar los undefined

#include "ARES-FOBOS.jsx"
#include "config.jsx"

var pj=openProject(rutaproyecto);

///////////////////////leo el archivo de texto donde esta el listado de items y lo guardo en el array texto
var linea;//renglon del archivo de texto
var items=new Array();
var nombre=new Array();
var cargo=new Array();

var numero_items=0;
var compBase = app.project.item(3);
//alert(compBase.name);
myFile=File(myFile);
myFile.open('r');
while(!myFile.eof){
            linea=myFile.readln();
            items=linea.split(separador); 
            nombre[numero_items]=items[0];
            cargo[numero_items]=items[1];
            numero_items=numero_items+1;
}
myFile.close();

var indice=0;
var compActive=compBase;

while(indice<numero_items){
    compActive=compBase.duplicate();
    compActive.name=nombre[indice];
    
    if(nombre[indice]==undefined){nombre[indice]="";}
    if(cargo[indice]==undefined){cargo[indice]="";}
    
    compActive.layer(1).property("Source Text").setValue(nombre[indice]);
    compActive.layer(2).property("Source Text").setValue(cargo[indice]);
    
    //si nombre esta vacio
    if(compActive.layer(1).property("Source Text").value==""){
        //alert("el valor de nombre es nulo");
    }
    //si cargo esta vacio
    if(compActive.layer(2).property("Source Text").value==""){
        compActive.layer(4).enabled=false;
    }
    export_video=app.project.renderQueue.items.add(compActive);
    //export_video.applyTemplate("CONFIG_ALPHA");
    fecha=new Date();
    mes=("0"+(fecha.getMonth()+1).toString()).slice(-2);
    dia=("0"+fecha.getDate().toString()).slice(-2);
    newPath = rutaSalida+'/'+fecha.getFullYear()+"-"+mes+"-"+dia+"/";
    oldName = nombre[indice]+"_"+indice+"_"+fecha.getHours()+"_"+fecha.getMinutes()+".mov";
export_video.outputModule(1).file = new File(newPath+oldName);
    indice=indice+1;
}
app.project.renderQueue.render();
app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
app.quit();