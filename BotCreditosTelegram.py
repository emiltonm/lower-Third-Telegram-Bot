from telegram.ext  import *
from datetime import date
from datetime import datetime
import io
from subprocess import call
from pathlib import Path as path
from pathlib import PurePath
import json

# estados de la conversacion
WAIT_INPUT_CREDIT=0




# comandos para telegram /algo
def startCommand(update,context):
    user = update.message.from_user
    usuario=user['username']
    mensaje='Hola '+usuario+' '
    mensaje=mensaje+'esta es la lista de tareas con la que te puedo ayudar:\n\n'
    mensaje=mensaje+'/sectorial para saber que periodista es el encargado de la sectorial indicada.\n\n'
    mensaje=mensaje+'/creditos para generar creditos del programa institucional seran enviados a tu correo.\n\n'
    mensaje=mensaje+'/programa control de avance del programa institucional.\n\n'    
    mensaje=mensaje+'/eventos Lista de eventos por fecha.\n\n'
    update.message.reply_text(mensaje)

def sectorialCommand(update,context):
    update.message.reply_text('funcion sectorial aun no implementada todavia')

def creditosCommand(update,context):
    update.message.reply_text('Enviame el credito en el siguiente formato:\n\nNombres Apellidos,Cargo\n\nejemplo:\nEmilton Mendoza Ojeda,Productor de Television')
    return WAIT_INPUT_CREDIT

def programaCommand(update,context):
    update.message.reply_text('funcion programa aun no implementada todavia')

def eventosCommand(update,context):
    update.message.reply_text('funcion eventos aun no implementada todavia')    


# funciones de procesos
def render_credit(update,context):
    if  not cfg["separacion"] in  update.message.text:
        update.message.reply_text('El texto no cumple con el formato adecuado')        
    else:
        user = update.message.from_user
        permisosTelegram=[]
        with open("permisos.emo","r") as filePermisos:
            permisosTelegram=filePermisos.read()
            permisosTelegram=permisosTelegram.split('\n')
        print("nombre de usuario es: "+user['username']+" "+datetime.now().strftime('%Y-%m-%d %H:%M:%S')+"\n")
        #print(permisosTelegram)

        if (user['username'].upper() in permisosTelegram):
            print("usuario autorizado\n")
            texto=update.message.text
            ruta=path(cfg["rutaAbsoluta"]) / 'databot.txt'
            data=open(str(ruta),'w')
            data.write(texto)
            data.close()
            today=date.today()
            nameDir=today.strftime("%Y-%m-%d")
            output=path(cfg["rutaSalida"])/nameDir
            output.mkdir(exist_ok=True, parents=True)
            call([str(path(cfg["rutaAfterEffects"])), "-r",str(path(cfg["rutaAbsoluta"])/path(cfg["nameScript"])) ])
            update.message.reply_text("Proceso ejecutado revisar carpeta compartida: creditos-programa/"+nameDir)
            #avisar cuando termine de renderizar comprobando si el archivo existe en la carpeta senalada
        else:
            update.message.reply_text('Usted no esta autorizado para ejecutar este procedimiento')
        return ConversationHandler.END

def createConfigJSX():
    with open("config.jsx",'w',encoding = 'utf-8') as f:
        f.write("var myFile=\""+cfg["rutaAbsoluta"]+"/"+cfg["nameDatabase"]+"\";\n")
        f.write("var rutaproyecto=\""+cfg["rutaAbsoluta"]+"/"+cfg["nameProject"]+"\";\n")
        f.write("var rutaSalida=\""+cfg["rutaSalida"]+"\";\n")
        f.write("var separador=\""+cfg["separacion"]+"\";\n")
        f.write("//realizado con la tecnologia marca EMI")

def main():
    with open("config.json","r") as archivo:
        c=archivo.read()
    c=json.loads(c)
    global cfg
    cfg=c["configuracion"]

    createConfigJSX()

    print('bot lower telegram iniciado')
    updater = Updater(cfg["apiKey"],use_context=True)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start",startCommand))
    dp.add_handler(CommandHandler("sectorial",sectorialCommand))
    dp.add_handler(CommandHandler("programa",programaCommand))
    dp.add_handler(CommandHandler("eventos",eventosCommand))
    
    dp.add_handler(ConversationHandler(
        entry_points=[
            CommandHandler("creditos",creditosCommand)
        ],
        states={
            WAIT_INPUT_CREDIT:[MessageHandler(Filters.text,render_credit)]
        },
        fallbacks=[]
    ))

    updater.start_polling()
    updater.idle()


if __name__ == "__main__":
    main()