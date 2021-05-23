import React, { useEffect, useState } from 'react'

export const FormComp = ({ members }) => {
    const [task, setTask] = useState({ reply: '', taskDone: '' })
    const [tasks, setTasks] = useState([])
    const [error, setError] = useState({ error: false, message: "Favor de rellenar todos los campos" });
    const [submit, setSubmit] = useState(false)
    const [viewport, setViewport] = useState(window.innerWidth);

    const handleChangeSelect = (ev) => {
        const id = ev.target.value;

        const filteredMember = members.members.find(member => member._id === id);
        if (!id) {
            return null
        }


        if (error.error) {
            setError({
                ...error,
                error: false
            })
        }
        setTask({
            ...task,
            name: filteredMember.name,
            sign: filteredMember.sign
        })
    }

    const handleChangeData = (ev) => {
        if (error.error) {
            setError({
                ...error,
                error: false
            })
        }
        setTask({
            ...task,
            [ev.target.name]: ev.target.value
        })
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setSubmit(true);
        if (!task.name || !task.reply || !task.sign || !task.taskDone) {
            setError({
                ...error,
                error: true,
            })
            setSubmit(false);
            return;
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }

        const response = await fetch('https://bitacora-app-server.herokuapp.com/tasks', options)
        const data = await response.json()
        console.log(data)
        setTask({
            ...task,
            reply: '',
            taskDone: ''
        })
        setSubmit(false);
    }

    useEffect(() => {
        const updateSize = () => {
            setViewport(window.innerWidth)
        }
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    useEffect(() => {
        const getAllTasks = async () => {
            const response = await fetch('https://bitacora-app-server.herokuapp.com/tasks');
            const tasks = await response.json();
            console.log(tasks.data.tasks)
            setTasks(tasks.data.tasks)
        }
        getAllTasks()
    }, [submit])

    return (
        <div>
            {
                error.error ?
                    <div className="alert alert-danger mt-3" role="alert">
                        {error.message}
                    </div>
                    :
                    null
            }
            <form className="mt-3 shadow p-3 rounded" onSubmit={handleSubmit}>
                <h2 className="font-weight-bold mb-4">Formulario tarea</h2>
                <div className="form-group">
                    <label>Selecciona usuario</label>
                    <select className="custom-select" onChange={handleChangeSelect}>
                        {
                            !task.name ? <option value={undefined}>--SELECCIONA UN MIEMBRO--</option> : null
                        }
                        {
                            members ? members.members.map(member => <option key={member.sign} value={member._id}>{member.name}</option>) : null
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label>Tarea realizada</label>
                    <input className="form-control" name="taskDone" onChange={handleChangeData} value={task.taskDone} />
                </div>

                <div className="form-group">
                    <label>Comentarios</label>
                    <input className="form-control" name="reply" onChange={handleChangeData} value={task.reply} />
                </div>

                <button className="btn btn-primary w-100" type="submit">Agregar tarea</button>
            </form>

            <h2 className="font-weight-bold mt-5">Tabla tareas</h2>
            {
                viewport < 768 ?
                    <table className="table table-primary mt-2">
                        <thead>
                            <tr>
                                <th scope="col">Miembro</th>
                                <th scope="col">Tarea realizada</th>
                                <th scope="col">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks !== 0 ?
                                    tasks.map(task => {
                                        const date = new Date(task.taskDate)

                                        return (
                                            <tr key={task.taskDate}>
                                                <td>{task.name}</td>
                                                <td>{task.taskDone}</td>
                                                <td>{`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    null
                            }
                        </tbody>
                    </table> :
                    <table className="table table-primary mt-2">
                        <thead>
                            <tr>
                                <th scope="col">Miembro</th>
                                <th scope="col">Tarea realizada</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Comentarios</th>
                                <th scope="col">Firma</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks !== 0 ?
                                    tasks.map(task => {
                                        const date = new Date(task.taskDate)

                                        return (
                                            <tr key={task.taskDate}>
                                                <td>{task.name}</td>
                                                <td>{task.taskDone}</td>
                                                <td>{`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}</td>
                                                <td>{task.reply}</td>
                                                <td>{task.sign}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    null
                            }
                        </tbody>
                    </table>
            }

        </div>
    )
}
