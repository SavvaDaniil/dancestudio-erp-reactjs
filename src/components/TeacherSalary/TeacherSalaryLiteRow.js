import { Button, Form } from "react-bootstrap";
import DateConverter from "../../utils/DateConverter"


export default function TeacherSalaryLiteRow(props){

    let dateConverter = new DateConverter();
    const dateOfAction = props.date_of_action !== null ? dateConverter.toDateLikedmY(props.date_of_action) : "<ошибка даты урока>";

    return (
        <tr>
            <td>
                {props.id}
            </td>
            <td>
                {dateOfAction}
            </td>
            <td>
                {props.danceGroupMicroViewModel !== null ? props.danceGroupMicroViewModel.name : "<группа не найдена>"}
            </td>
            <td>
                {props.teacherMicroViewModel !== null ? props.teacherMicroViewModel.name : "<преподаватель не найден>"}
            </td>
            <td>
                {props.visits_count}
            </td>
            <td>
                {props.price}
            </td>
            <td>
                <Form>
                    <Form.Control as="select" name="status" defaultValue={props.status}>
                        <option value={0}>Не выдана</option>
                        <option value={1}>Выдано</option>
                    </Form.Control>
                </Form>
            </td>
            <td>
                <Button variant="info" type="button" size="sm"
                onClick={() => props.getMoreInfoCallback(props.id)}
                >Edit</Button>
            </td>
            <td>
                <Button variant="danger" type="button" size="sm"
                onClick={() => props.deletePrepareCallback(props.id)}
                >Delete</Button>
            </td>
        </tr>
    )
}