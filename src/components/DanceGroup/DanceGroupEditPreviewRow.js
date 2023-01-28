import {Button, Alert} from 'react-bootstrap';

export default function DanceGroupEditPreviewRow(props) {

    return(
        <tr>
            <td>
                {props.id}
            </td>
            <td>
                {props.name}
            </td>
            <td>
                {props.teacherMicroViewModel !== null ? props.teacherMicroViewModel.name : "- не установлено -"}
            </td>
            <td>
                <Alert variant={props.status === 1 ? "success" : "danger"}>
                    {props.status === 1 ? "Да" : "Нет"}
                </Alert>
            </td>
            <td>
                <Alert variant={props.status_for_app === 1 ? "success" : "danger"}>
                    {props.status_for_app === 1 ? "Да" : "Нет"}
                </Alert>
            </td>
            <td>
                <Button variant="info" size="sm" onClick={() => props.getDanceGroupEdit(props.id)}>Редактировать</Button>
                <Button variant="danger" size="sm" onClick={() => props.deletePrepareDanceGroup(props.id, props.name)}>Удалить</Button>
            </td>
        </tr>
    )
}
