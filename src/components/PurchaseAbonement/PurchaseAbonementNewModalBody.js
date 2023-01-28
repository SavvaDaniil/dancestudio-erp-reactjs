import { Form } from "react-bootstrap";


export default function PurchaseAbonementNewModalBody(props){


    return (
        <Form>
            <Form.Group>
                <Form.Label>Наличными</Form.Label>
                <Form.Control name="price" type="number" placeholder="Наличными"  
                    defaultValue={props.price}
                    onChange={props.formEditAbonementBuyListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Безналичный способ оплаты:</Form.Label>
                <Form.Control name="cashless" type="number" placeholder="Безналичные"  
                    defaultValue={0}
                    onChange={props.formEditAbonementBuyListener}
                />
            </Form.Group>

            <hr />

            <Form.Group>
                <Form.Label>Количество занятий:</Form.Label>
                <Form.Control name="visits" type="number" placeholder="Количество занятий" 
                    disabled={props.special_status === "raz"} 
                    defaultValue={props.visits}
                    onChange={props.formEditAbonementBuyListener}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Дней действует с момента активации:</Form.Label>
                <Form.Control name="days" type="number" placeholder="Дней действует с момента активации"  
                    disabled={props.special_status === "raz"} 
                    defaultValue={props.days}
                    onChange={props.formEditAbonementBuyListener}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Комментарий:</Form.Label>
                <Form.Control name="comment" as="textarea" rows={5} placeholder="Комментарий"  
                    onChange={props.formEditAbonementBuyListener}
                />
            </Form.Group>

        </Form>
    )
}