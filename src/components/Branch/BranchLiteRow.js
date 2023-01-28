
export default function BranchLiteRow(props){

    return (
        <tr>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.coordinates}</td>
            <td>
                <button type="button" className="btn btn-info btn-sm" onClick={() => props.editBranch(props.id)}>Редактировать</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => props.deletePrepare(props.id, props.name)}>Удалить</button>
            </td>

        </tr>
    )
}