import React, {Component} from "react";
import {Button, Table, Modal, Form} from 'react-bootstrap';
import { SystemLoadingPage } from "./SystemLoading/SystemLoadingPage";
import BranchService from "../service/BranchService";
import { useNavigate } from "react-router-dom";
import AdminMiddleWare from "../utils/AdminMiddleware";
import BranchLiteRow from "../components/Branch/BranchLiteRow";

//import Branch from "./Branch/Branch";



class Branches extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading : false,
            isError : false,

            branchLiteViewModels : [],
            newBranchName : "",
            newBranchCoordinates : "",
            newBranchDescription : "",

            branchInfoViewModel : null,

            modalBranchModel : {},
            modalAddNewBranchIsShowing : false,
            modalDeleteBranchIsShowing : false,
            modalEditBranchIsShowing : false,
            modalBranchDynamicDateIsShowing : false,
            branch_id : 0,
            branch_name : "",
            
            branchService : new BranchService()
        }
        this.search = this.search.bind(this);

        this.newBranchFormListener = this.newBranchFormListener.bind(this);

        this.addBranch = this.addBranch.bind(this);
        this.getBranch = this.getBranch.bind(this);
        this.save = this.save.bind(this);
        
        this.deletePrepare = this.deletePrepare.bind(this);
        this.modalDeleteBranchOpen = this.modalDeleteBranchOpen.bind(this);
        this.modalDeleteBranchClose = this.modalDeleteBranchClose.bind(this);
        this.deleteBranch = this.deleteBranch.bind(this);

        this.modalAddNewBranchOpen = this.modalAddNewBranchOpen.bind(this);
        this.modalAddNewBranchClose = this.modalAddNewBranchClose.bind(this);

        this.branchEditFormListener = this.branchEditFormListener.bind(this);
        this.modalEditBranchOpen = this.modalEditBranchOpen.bind(this);
        this.modalEditBranchClose = this.modalEditBranchClose.bind(this);

        
    }

    async componentDidMount(){
        this.search();
    }

    async search(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLoading: true,
            isError: false
        });
        const jsonAnswerStatus = await this.state.branchService.listAllLites(jwt);
        
        this.setState({
            isLoading: false
        });
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.branchLiteViewModels !== null){
            this.setState({
                branchLiteViewModels : jsonAnswerStatus.branchLiteViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    async addBranch(){
        if(this.state.newBranchName === ""){
            alert("Поле 'наименование' обязательно для ввода");
            return;
        }
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLoading: true
        });
        const jsonAnswerStatus = await this.state.branchService.add(
            jwt, 
            this.state.newBranchName, 
            this.state.newBranchCoordinates, 
            this.state.newBranchDescription
        );
        
        this.setState({
            isLoading: false
        });
        if(jsonAnswerStatus.status === "success"){
            this.modalAddNewBranchClose();
            this.search();
        } else {
            alert("неизвестная ошибка на сервере");
        }
    }

    async save(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        this.setState({
            isLoading: true
        });
        const jsonAnswerStatus = await this.state.branchService.update(
            jwt, 
            this.state.branchInfoViewModel.id, 
            this.state.branchInfoViewModel.name, 
            this.state.branchInfoViewModel.coordinates, 
            this.state.branchInfoViewModel.description
        );

        if(jsonAnswerStatus.status === "success"){
            this.search();
            this.getBranch(this.state.branchInfoViewModel.id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
        this.setState({
            isLoading: false
        });
    }



    newBranchFormListener(e){
        switch(e.target.name){
            case "name":
                this.setState({newBranchName : e.target.value});
                break;
            case "description":
                this.setState({newBranchDescription : e.target.value});
                break;
            case "coordinates":
                this.setState({newBranchCoordinates : e.target.value});
                break;
            default:
                break;
        }
    }
    branchEditFormListener(e){
        let branchInfoViewModel = this.state.branchInfoViewModel;
        switch(e.target.name){
            case "name":
                branchInfoViewModel.name = e.target.value;
                break;
            case "coordinates":
                branchInfoViewModel.coordinates = e.target.value;
                break;
            case "description":
                branchInfoViewModel.description = e.target.value;
                break;
            default:
                break;
        }
        console.log("branchInfoViewModel.name: " + branchInfoViewModel.name);
        this.setState({branchInfoViewModel : branchInfoViewModel});
    }



    
    modalEditBranchOpen(){
        this.setState({
            modalEditBranchIsShowing : true
        });
    }
    modalEditBranchClose(){
        this.setState({
            modalEditBranchIsShowing : false
        });
    }
    async getBranch(branch_id){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.branchService.get(jwt, branch_id);

        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.branchInfoViewModel !== null){
            this.setState({
                branchInfoViewModel : jsonAnswerStatus.branchInfoViewModel
            });
            this.modalEditBranchOpen();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }


    modalAddNewBranchOpen(){
        this.setState({
            newBranchName : "",
            newBranchCoordinates : "",
            newBranchDescription : "",
            modalAddNewBranchIsShowing : true
        });
    }
    modalAddNewBranchClose(){
        this.setState({
            modalAddNewBranchIsShowing : false
        });
    }


    deletePrepare(branch_id, branch_name){
        this.setState({
            branch_id : parseInt(branch_id, 10),
            branch_name : branch_name
        });
        this.modalDeleteBranchOpen();
    }
    modalDeleteBranchOpen(){
        this.setState({
            modalDeleteBranchIsShowing : true
        });
    }
    modalDeleteBranchClose(){
        this.setState({
            modalDeleteBranchIsShowing : false
        });
    }
    async deleteBranch(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.branchService.delete(jwt, this.state.branch_id);

        if(jsonAnswerStatus.status === "success"){
            this.modalDeleteBranchClose();
            this.search();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    render(){

        let branchLitesTable = "";
        if(this.state.isLoading){
            branchLitesTable = <SystemLoadingPage />
        } else if(this.state.branchLiteViewModels.length > 0){
            const branchesLiteRows = this.state.branchLiteViewModels.map((content, index) => {
                return <BranchLiteRow
                key = {index}
                id = {content.id}
                name={content.name}
                coordinates={content.coordinates}
                deletePrepare = {this.deletePrepare}
                editBranch = {this.getBranch}
                />
            });

            branchLitesTable = <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Наименование
                        </th>
                        <th>
                            Координаты в формате 55.781711,37.587017
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {branchesLiteRows}
                </tbody>
            </Table>

        } else {
            branchLitesTable = <center><i>Филиалов не найдено</i></center>;
        }

        return(
            <div className="row page branches">
                <div className="col-12">
                    <Button variant="secondary" type="button" onClick={this.modalAddNewBranchOpen}>Добавить </Button>
                </div>


                {branchLitesTable}

                <Modal
                show={this.state.modalAddNewBranchIsShowing}
                onHide={this.modalAddNewBranchClose}
                animation={false}
                size="lg"
                className="modalAddNewBranch"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Новый филиал</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Наименование</Form.Label>
                                <Form.Control type="text" name="name" placeholder="Наименование" maxLength="256" onChange={this.newBranchFormListener} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Координаты</Form.Label>
                                <Form.Control type="text" name="coordinates" placeholder="Координаты" maxLength="256" onChange={this.newBranchFormListener} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Описание в приложение:</Form.Label>
                                <Form.Control as="textarea" name="description" rows={5} onChange={this.newBranchFormListener} />
                            </Form.Group>

                        </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.addBranch}>
                            Добавить
                        </Button>
                        <Button variant="secondary" onClick={this.modalAddNewBranchClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal
                show={this.state.modalEditBranchIsShowing}
                onHide={this.modalEditBranchClose}
                animation={false}
                size="lg"
                className="modalEditBranch"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Редактирование филиала</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Наименование</Form.Label>
                                <Form.Control name="name" type="text" placeholder="Наименование" maxLength="256" 
                                defaultValue={this.state.branchInfoViewModel !== null ? this.state.branchInfoViewModel.name : ""} 
                                onChange={this.branchEditFormListener} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Координаты</Form.Label>
                                <Form.Control name="coordinates" type="text" placeholder="Координаты" maxLength="256" 
                                defaultValue={this.state.branchInfoViewModel !== null ? this.state.branchInfoViewModel.coordinates : ""} 
                                onChange={this.branchEditFormListener} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Описание в приложение:</Form.Label>
                                <Form.Control name="description" as="textarea" rows={5} 
                                defaultValue={this.state.branchInfoViewModel !== null ? this.state.branchInfoViewModel.description : ""} 
                                onChange={this.branchEditFormListener} />
                            </Form.Group>

                            

                        </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.save} disabled={this.state.isLoading}>
                            Сохранить
                        </Button>
                        <Button variant="secondary" onClick={this.modalEditBranchClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal
                show={this.state.modalDeleteBranchIsShowing}
                onHide={this.modalDeleteBranchClose}
                animation={false}
                size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Удалить филиал</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Вы уверены, что хотите удалить филиал "{this.state.branch_name}"?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.deleteBranch}>
                            Да
                        </Button>
                        <Button variant="secondary" onClick={this.modalDeleteBranchClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}


export default function BranchesPage(props){
    const navigate = useNavigate();
    return(<Branches navigate={navigate}></Branches>)
}