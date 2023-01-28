import { Form } from "react-bootstrap";

export default function TeacherRateLiteRow(props){

    return (
        <tr>
            <td>
                <Form.Control name="students" type="number" defaultValue={props.students} onChange={(e) => props.saveTeacherRate(e, props.id)} />
            </td>
            <td>
                <Form.Control name="price" type="number" defaultValue={props.price} onChange={(e) => props.saveTeacherRate(e, props.id)} />
            </td>
            <td>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => props.deleteTeacherRate(props.id, props.name)} disabled={props.isLoading}>Удалить</button>
            </td>

        </tr>
    )
}