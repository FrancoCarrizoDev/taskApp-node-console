require('colors')
const { leerDB } = require('./helpers/guardarArchivo')
const { guardarDB } = require('./helpers/guardarArchivo')
const {
    inquireMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
} = require('./helpers/inquirer')

const Tareas = require('./models/tareas')

console.clear()

const main = async () => {
    // opt es la variable que administra el do while dependiendo del ingreso del usuario
    let opt = ''
    // esta linea llama a mi clase de tareas con todos sus métodos y posibilidades
    const tareas = new Tareas()
    // aqui leemos la base de datos con las respectivas tareas y sus estados
    const tareasDB = leerDB()

    // pregunto si mi db tiene datos y luego los cargo en memoria en su respectiva clase
    if (tareasDB) {
        tareas.cargarTareasDesdeArray(tareasDB)
    }
    // aqui llamo a mi do while para hacer el menú manejable por opciones
    do {
        // espero a que se ejecute y dibuje mi interfaz de menú seleccionable
        opt = await inquireMenu()
        // depende de la opcion que elija el usuario el switch queda a la espera de la opción a ejecutar
        switch (opt) {
            case '1':
                {
                    const desc = await leerInput('Descripción: ')
                    tareas.crearTarea(desc)
                }
                break
            case '2':
                tareas.listadoCompleto()
                break
            case '3':
                tareas.listarPendientesCompletadas(true)
                break
            case '4':
                tareas.listarPendientesCompletadas(false)
                break
            case '5':
                {
                    const ids = await mostrarListadoChecklist(tareas.listadoArr)
                    tareas.toggleCompletadas(ids)
                }
                break
            case '6':
                {
                    const id = await listadoTareasBorrar(tareas.listadoArr)
                    if (id !== '0') {
                        const ok = await confirmar('¿Estás seguro?')
                        if (ok) {
                            tareas.borrarTarea(id)
                            console.log('Tarea borrada')
                        }
                    }
                }

                break
            default:
                break
        }

        guardarDB(tareas.listadoArr)
        if (opt !== '0') await pausa()
    } while (opt !== '0')
}
main()
