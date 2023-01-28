import { Button, Form, Table } from "react-bootstrap";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";


function buildTableOfDaysOfWeek(props, danceGroupDayOfWeekLiteViewModels, is_event){
    danceGroupDayOfWeekLiteViewModels = danceGroupDayOfWeekLiteViewModels.filter((obj) => obj.is_event === (is_event ? 1 : 0));

    if(danceGroupDayOfWeekLiteViewModels.length === 0)return <></>;
    const trsDaysOfWeek = danceGroupDayOfWeekLiteViewModels.map((content, index) => {
        const daysOfWeek = ["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВСК"];
        const dayOfWeekOptions = daysOfWeek.map((content, index) => {
            return <option key={index + 1} value={index + 1} >{content}</option>
        });

        return <tr key={index}>
            <td>
                {content.id}
            </td>

            <td className={content.is_event === 1 ? "hide" : ""}>
                <Form.Control key={content.day_of_week} name="day_of_week" as="select" defaultValue={content.day_of_week}
                onChange={(e) => props.saveDanceGroupDayOfWeek(e, content.id)}
                >
                    <option value="0">---</option>
                    {dayOfWeekOptions}
                </Form.Control>
            </td>
            <td className={content.is_event === 1 ? "" : "hide"}>
                <Form.Control key={content.date_of_event} name="date_of_event" type="date" defaultValue={content.date_of_event}
                onChange={(e) => props.saveDanceGroupDayOfWeek(e, content.id)}
                />
            </td>

            <td>
                <input name="time_from" type="time" className="form-control" defaultValue={content.time_from}
                onChange={(e) => props.saveDanceGroupDayOfWeek(e, content.id)}
                />
            </td>
            <td>
                <input name="time_to" type="time" className="form-control" defaultValue={content.time_to}
                onChange={(e) => props.saveDanceGroupDayOfWeek(e, content.id)}
                />
            </td>
            <td>
                <Form.Group>
                    <Form.Control name="status" as="select" defaultValue={content.status}
                    onChange={(e) => props.saveDanceGroupDayOfWeek(e, content.id)}
                    >
                    <option value="0">Не действует</option>
                    <option value="1">Действует</option>
                    </Form.Control>
                </Form.Group>
            </td>
            <td>
                <Button size="sm" variant="danger"
                onClick={() => props.deleteDanceGroupDayOfWeek(content.id)}
                >
                    Удалить
                </Button>
            </td>
        </tr>
    });
    

    return <Table striped bordered hover>
        <thead>
            <tr>
                <th>
                    ID
                </th>
                <th>
                    День недели
                </th>
                <th>
                    Время с
                </th>
                <th>
                    Время по
                </th>
                <th>
                    Статус
                </th>
                <th>
                </th>
            </tr>
        </thead>
        <tbody>
            {trsDaysOfWeek}
        </tbody>
    </Table>
}

export default function DanceGroupEditForm(props){

    if(props.danceGroupEditModel === null)return <></>;
    if(props.isLoading)return <SystemLoadingPage />;

    
    let tableOfDaysOfWeekEditDanceGroup = <></>;
    if(props.danceGroupDayOfWeekLiteViewModels.length > 0){
        tableOfDaysOfWeekEditDanceGroup = buildTableOfDaysOfWeek(props, props.danceGroupDayOfWeekLiteViewModels, false);
    }

    let tableOfDaysOfWeekEventEditDanceGroup = <></>;
    if(props.danceGroupDayOfWeekLiteViewModels.length > 0){
        tableOfDaysOfWeekEventEditDanceGroup = buildTableOfDaysOfWeek(props, props.danceGroupDayOfWeekLiteViewModels, true);
    }
    

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Наименование</Form.Label>
                    <Form.Control name="name" type="text" placeholder="Наименование" maxLength="216" 
                        defaultValue={props.danceGroupEditModel.name}
                        onChange={props.editDanceGroupFormListener}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Преподаватель:</Form.Label>
                    <Form.Control name="teacher_id" as="select" 
                        defaultValue={props.danceGroupEditModel.teacher_id}
                        onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">- Не указано -</option>
                        {props.teacherMicroOptions}
                    </Form.Control>
                </Form.Group>

                <hr />
                <p>
                    Значения в полях автоматически сохранится через 1.5 секунды после редактирования
                </p>

                <Button type="button" size="sm" variant="success" onClick={() => props.addDanceGroupDayOfWeek(props.danceGroupEditModel.id, false)}>
                    Добавить день занятия
                </Button>

                {tableOfDaysOfWeekEditDanceGroup}

                <hr />
                <Form.Group>
                    <Form.Label>Описание в приложение:</Form.Label>
                    <Form.Control name="description" as="textarea" rows={5} defaultValue={props.danceGroupEditModel.description}
                        onChange={props.editDanceGroupFormListener}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Статус видимости для администраторов:</Form.Label>
                    <Form.Control name="status" as="select" defaultValue={props.danceGroupEditModel.status}
                        onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">Не виден</option>
                        <option value="1">Виден</option>
                    </Form.Control>
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Статус видимости в приложении:</Form.Label>
                    <Form.Control name="status_for_app" as="select" defaultValue={props.danceGroupEditModel.status_for_app}
                        onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">Не виден</option>
                        <option value="1">Виден</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Статус творческой группы:</Form.Label>
                    <Form.Control name="status_of_creative" as="select" defaultValue={props.danceGroupEditModel.status_of_creative}
                        onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">Обычная группа</option>
                        <option value="1">Творческая группа 
                        (в приложении можно отметиться только подключённым пользователям)</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Подключённый филиал:</Form.Label>
                    <Form.Control name="branch_id" as="select" defaultValue={props.danceGroupEditModel.branch_id}
                        onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">- Не указано -</option>
                        {props.brancheMicroOptions}
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Алгоритм отмечания на занятия через приложение:</Form.Label>
                    <Form.Control name="is_active_reservation" as="select" defaultValue={props.danceGroupEditModel.is_active_reservation}
                        onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">авто - возможность отмены блокируется за указанное в общих настройках время</option>
                        <option value="1">преподаватель - преподаватель через приложение отмечает 
                        факт присутствия на занятии клиента</option>
                    </Form.Control>
                    <p>При отмечании на занятие через преподавателя, 
                        если преподаватель не отметит клиента, бронь отменится и занятие автоматически 
                        вернётся на следующие день после занятия.</p>
                </Form.Group>


                <hr />

                <h5>Дни занятий</h5>

                <Form.Group>
                    <Form.Label>Режим работы:</Form.Label>
                    <Form.Control name="is_event" as="select" defaultValue={props.danceGroupEditModel.is_event}
                    onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">Обычная группа (в расписании в зависимости от проставленных дней выше)</option>
                        <option value="1">Мероприятие (в указанные дни, править можно по кнопке ниже)</option>
                    </Form.Control>
                    <p>При режиме "обычная группа", дни занятий считаются как из дней недели, так и отдельные дни 
                        указанные в таблице ниже.<br />
                    При режиме "Мероприятие" считаются только дни указанные в таблице ниже<br />
                    Значения в полях автоматически сохранится через 1.5 секунды после редактирования</p>
                </Form.Group>

                <Button type="button" size="sm" variant="success" onClick={() => props.addDanceGroupDayOfWeek(props.danceGroupEditModel.id, true)}>
                    Добавить день мероприятия
                </Button>
                
                {tableOfDaysOfWeekEventEditDanceGroup}

                <hr />

                <h5>Доступность абонементов на занятие</h5>

                <Form.Group>
                    <Form.Label>Доступны все абонементы:</Form.Label>
                    <Form.Control name="is_abonements_allow_all" as="select" defaultValue={props.danceGroupEditModel.is_abonements_allow_all}
                        onChange={props.editDanceGroupFormListener}
                    >
                        <option value="0">Нет</option>
                        <option value="1">Да</option>
                    </Form.Control>
                    <p>При выборе "Да" данного пункта все поля ниже игнорируются, что бы в них не стояло. При выборе "Нет", 
                    система будет искать доступные для показа в приложении абонементы ниже.</p>
                </Form.Group>

                <hr />

                {props.abonementsTable}


            </Form>
        </>
    )
}