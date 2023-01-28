import React, {Component} from "react";
import {Button, Table, Modal} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import constant from "../utils/GlobalValues";
import AdminMiddleWare from "../utils/AdminMiddleware";
//import Abonement from "./Abonement/Abonement";
//import ModalAbonementDynamicDate from "./Abonement/ModalAbonementDynamicDate";
import {SystemLoadingPage} from "./SystemLoading/SystemLoadingPage";
import AbonementInfoRow from "../components/Abonement/AbonementInfoRow";
import AbonementService from "../service/AbonementService";


class Abonements extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLaunch : false,
            isLoading : false,
            isError: false,
            abonementService : new AbonementService(),

            abonementInfoViewModels : [],
            abonementModel : null,
            modalDeleteAbonementIsShowing : false,
            modalAbonementDynamicDateIsShowing : false,
            abonement_id : "",
            abonement_name : "",
            listAbonementDynamicDate : [],
            searchAbonementDynamicDateOfAbonementIsLaunch : false
        }
        this.search = this.search.bind(this);
        this.addAbonement = this.addAbonement.bind(this);
        this.update = this.update.bind(this);
        this.deletePrepare = this.deletePrepare.bind(this);
        this.modalDeleteAbonementClose = this.modalDeleteAbonementClose.bind(this);
        this.deleteAbonementFetch = this.deleteAbonementFetch.bind(this);

        this.abonementDynamicDateOfAbonementPrepare = this.abonementDynamicDateOfAbonementPrepare.bind(this);
        this.modalAbonementDynamicDateOpen = this.modalAbonementDynamicDateOpen.bind(this);
        this.modalAbonementDynamicDateClose = this.modalAbonementDynamicDateClose.bind(this);
        this.searchAbonementDynamicDateOfAbonement = this.searchAbonementDynamicDateOfAbonement.bind(this);
    }

    async componentDidMount(){
        await this.search();
        //this.props.changeTitle();
    }

    async search(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLoading: true,
            isError: false
        });
        const jsonAnswerStatus = await this.state.abonementService.search(jwt);
        //console.log(jsonAnswerStatus);

        this.setState({
            isLoading : false,
            isError : false
        });
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.abonementInfoViewModels !== null){
            this.setState({
                abonementInfoViewModels : jsonAnswerStatus.abonementInfoViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }


    async addAbonement(special_status, is_trial){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.abonementService.addAbonement(jwt, special_status, is_trial);
        if(jsonAnswerStatus.status === "success"){
            this.search();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    async update(loadingFinishCallback, abonement_id, name, days, price, visits, status_of_visible, status_for_app, is_private){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.abonementService.update(jwt, abonement_id, name, days, price, visits, status_of_visible, status_for_app, is_private);
        if(jsonAnswerStatus.status === "success"){
            loadingFinishCallback();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    abonementDynamicDateOfAbonementPrepare(id_of_abonement){
        this.searchAbonementDynamicDateOfAbonement(id_of_abonement);
    }
    modalAbonementDynamicDateOpen(){
        this.setState({
            modalAbonementDynamicDateIsShowing : true
        });
    }
    modalAbonementDynamicDateClose(){
        this.setState({
            modalAbonementDynamicDateIsShowing : false
        });
    }
    searchAbonementDynamicDateOfAbonement(id_of_abonement){
        this.setState({
            modalAbonementDynamicDateIsShowing : false,
            searchAbonementDynamicDateOfAbonementIsLaunch : false
        });
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        fetch(constant.baseDomain + "/api/abonementdynamicdate/allbyabonement",
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            //credentials: 'include',
            headers: {
                'Authorization': 'Bearer '+ jwt, 
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                "id_of_abonement" : id_of_abonement
            })
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    listAbonementDynamicDate : result.listAbonementDynamicDate,
                    id_of_abonement : id_of_abonement,
                    searchAbonementDynamicDateOfAbonementIsLaunch : true
                });
                this.modalAbonementDynamicDateOpen();
            },
            (error) => {
                alert("Ошибка связи с сервером");
            }
        )
    }


    


    deletePrepare(abonement_id, abonement_name){
        this.setState({
            modalDeleteAbonementIsShowing : true,
            abonement_id : abonement_id,
            abonement_name : abonement_name
        });
    }
    modalDeleteAbonementClose(){
        this.setState({
            modalDeleteAbonementIsShowing : false
        });
    }
    async deleteAbonementFetch(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.abonementService.delete(jwt, this.state.abonement_id);
        if(jsonAnswerStatus.status === "success"){
            this.modalDeleteAbonementClose();
            this.search();
        } else {
            alert("Неизвестная ошибка на сервере");
        }

    }



    render(){

        let abonementsTable = <center><i>Абонементов не найдено</i></center>;
        let abonementInfoRows = [];

        if(this.state.isLoading){
            abonementsTable = <SystemLoadingPage />
        } else if(this.state.abonementInfoViewModels.length > 0){
            abonementInfoRows = this.state.abonementInfoViewModels.map((content, index) => {
                return <AbonementInfoRow
                    key={index}
                    id={content.id}
                    name={content.name}
                    days={content.days}
                    price={content.price}
                    visits={content.visits}
                    special_status={content.special_status}
                    is_trial={content.is_trial}
                    status_of_visible={content.status_of_visible}
                    status_for_app={content.status_for_app}
                    is_private={content.is_private}

                    update={this.update}
                    deletePrepare={this.deletePrepare}
                />
            });

            abonementsTable = <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th className="name">
                            Название абонемента
                        </th>
                        <th className="midWidth">
                            На сколько дней
                        </th>
                        <th className="midWidth">
                            Цена (руб.)
                        </th>
                        <th className="midWidth">
                            На сколько занятий
                        </th>
                        <th>
                            Статус абонемента
                        </th>
                        <th className="small">
                            Пробное?
                        </th>
                        <th className="small">
                            Гибкая дата окончания
                        </th>
                        <th className="small">
                            Отображать админам?
                        </th>
                        <th className="small">
                            Отображать в приложении?
                        </th>
                        <th className="small">
                            Приватный доступ в приложении
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {abonementInfoRows}
                </tbody>
            </Table>
        }





        return(
            <div className="row page abonements">
                <div className="col-12 control">
                    <Button variant="secondary" type="button" onClick={() => this.addAbonement("raz", 0)}>Добавить разовое</Button>
                    <Button variant="secondary" type="button" onClick={() => this.addAbonement("usual", 0)}>Добавить абонемент</Button>
                    <Button variant="secondary" type="button" onClick={() => this.addAbonement("unlim", 0)}>Добавить безлимитный абонемент</Button>
                    <hr />
                    <p><i>Кнопки ниже добавляют "пробные" абонементы в приложении. Они будут доступны для пользователей только в первый раз посещения занятия.</i></p>
                    <Button variant="secondary" type="button" onClick={() => this.addAbonement("raz", 1)}>Добавить пробное разовое</Button>
                </div>

                {abonementsTable}

                <Modal
                show={this.state.modalDeleteAbonementIsShowing}
                onHide={this.modalDeleteAbonementClose}
                animation={false}
                size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Удалить абонемент</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Вы уверены, что хотите удалить абонемент "{this.state.abonement_name}"?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.deleteAbonementFetch}>
                            Да
                        </Button>
                        <Button variant="secondary" onClick={this.modalDeleteAbonementClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}



export default function AbonementsPage(props){
    const navigate = useNavigate();
    return(<Abonements navigate={navigate}></Abonements>)
}