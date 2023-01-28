
export default function TeacherLiteRow(props){

    return (
        <tr>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.is_any_dance_group ? "Да" : "Нет"}</td>
            <td>
                <button type="button" className="btn btn-info btn-sm" onClick={() => props.getTeacher(props.id)}>Редактировать</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => props.deletePrepare(props.id, props.name)}>Удалить</button>
            </td>

        </tr>
    )
}