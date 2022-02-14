/*
LIBRERIA DE FUNCIONES AFTER EFFECTS 02 marzo 2020 12:58
#include "ARES-FOBOS.jsx"
*/
/////////////////////// VARIABLES GLOBALES
var activeComposition;
var activeItem;
/////////////////////// FUNCION DE PRUEBA
function testFobos(){
    alert("libreria correctamente importada");
}
/////////////////////// FUNCIONES DE PROYECTO
function openProject(ruta){
    var my_file = new File(ruta);
    if (my_file.exists) {
        new_project = app.open(my_file);
    }
    return new_project;
}
/////////////////////// FUNCIONES DE CAPAS

//Funcion que crea una marca en la capa seleccionada 
//createMakerInLayer(app.project.activeItem.selectedLayers[0],"prueba",2,1);
function createMarkerInLayer(nombre,entrada,duracion){
    activeItem.selected = true;
    var myMarker = new MarkerValue(nombre);
    myMarker.duration = duracion
    activeItem.property("Marker").setValueAtTime(activeItem.startTime+entrada, myMarker);
}

//Funcion que agrega un efecto del tipo control
//El tipo es el nombre original del efecto
//addEffect(selectedLayers[i],"Slider Control","TRANSICION TIME","Slider",0.75);
function addEffect(tipo,nombre,propiedad,valor){
    var idEffect=activeItem.property("Effects").addProperty(tipo);
    activeItem.property("Effects").property(tipo).property(propiedad).setValue(valor);
    idEffect.name=nombre;
}

//applyExpression//repetida la dejo por si la utilice antes
//function applyExpression(nombreEfecto,propiedad,expresion){
//    activeItem.property("Effects").property(nombreEfecto).property(propiedad).expression=expresion;
//}

//apaga el efecto de una capa
function disableEffect(nombre){
    activeItem.property("Effects").property(nombre).enabled=0;
}

/////////////////////// FUNCIONES DE CARPETAS

//crea una carpeta en el area de trabajo
function makeBin(nombre){
    return app.project.items.addFolder(nombre);
}

//coloca un item dentro de una carpeta
function inToBin(item,carpeta){
    item.parentFolder=carpeta;
}

/////////////////////// FUNCIONES DE COMPOSICION

//crea una composicion
//proporcion ancho entre alto, tiempo en segundos
function makeComp(nombre,ancho,alto,proporcion,tiempo,framerate){
    return app.project.items.addComp(nombre,ancho,alto,proporcion,tiempo,framerate);
}

//crea una composicion FULL HD 
function makeCompFHD(nombre,tiempo){
    return app.project.items.addComp(nombre,1920,1080,1920/1080,tiempo,29.97);    
}


//activa la composicion senalada para trabajar sobre ella
function setActiveComp(composicion){
    composicion.openInViewer(); //la muestro en pantalla
    app.activeViewer.setActive();  
    activeComposition = app.project.activeItem;
}

/////////////////////// FUNCIONES DE ITEMS

//crea un solido del tamano y proporcion de la composicion
//si el tiempo es 0 se le asigna el tiempo de la composicion 
function makeSolid(nombre,color,tiempo){
    if (tiempo==0){
        tiempo=activeComposition.duration;
    }
    return activeComposition.layers.addSolid(color,nombre,activeComposition.width,activeComposition.height,activeComposition.pixelAspect,tiempo);
}

function makeNull(tiempo){
    if (tiempo==0){
        tiempo=activeComposition.duration;
    }
    return activeComposition.layers.addNull(tiempo);
}

function makeText(texto){
    return activeComposition.layers.addText(texto);
}

function setActiveItem(item){
    activeItem=item;
}

function setValueEffect(name_effect,propiedad,valor){
    activeItem.property("Effects").property(name_effect).property(propiedad).setValue(valor);
}

function setExpression(name_effect,propiedad,stringexp){
    activeItem.property("Effects").property(name_effect).property(propiedad).expression=stringexp;
}

function keyFrameIn(name_effect,propiedad,valor,time_sec){
    activeItem.property("Effects").property(name_effect).property(propiedad).setValueAtTime(time_sec,valor);    
}

function moveTo(x,y,z){
    activeItem.position.setValue([x,y,z]);
}


/////////////////////// FUNCIONES DE ARCHIVOS

function fileToRow(ruta){
    var myFile = File(ruta);
    var MiTexto=new Array();
    var numero_items=0;
    myFile.open('r');
    while(!myFile.eof){
                MiTexto[numero_items]=myFile.readln();
                numero_items=numero_items+1;
    }
    myFile.close();
    return MiTexto;
}

function fileToText(ruta){
    var myFile = File(ruta);
    var MiTexto;
    myFile.open('r');
    MiTexto=myFile.read();
    myFile.close();
    return MiTexto;
}

function importFile(ruta){
    var io = new ImportOptions(File(ruta));
    app.project.importFile(io);
}
