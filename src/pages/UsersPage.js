import React, {Component} from "react";
import { useNavigate } from "react-router-dom";
import {Button, Modal, Form, InputGroup} from 'react-bootstrap';
import UserSearchPreviewRow from "../components/User/UserSearchPreviewRow";
import UserAddModal from "../components/User/UserAddModal";
import AdminMiddleWare from "../utils/AdminMiddleware";
import UserService from "../service/UserService";
import { SystemLoadingPage } from "./SystemLoading/SystemLoadingPage";
import UserEditSubview from "../components/User/UserEditSubview";

//import User from "./User/User";
//import ModalAddNewUser from "./Modal/ModalAddNewUser";
//import UsersSearch from "./Users/UsersSearch";
//import User from "./Users/User";



class Users extends Component {
    constructor(props){
        super(props);
        this.state = {
            userService : new UserService(),
            isLoading : false,
            isError : false,

            isLaunch : false,
            activePage : 1,
            queryString : null,
            isNeedCount : true,
            countUserSearchQueryAll : 0,
            countUserSearchQuery : 0,
            countPages : 0,
            userSearchPreviewViewModels : [],

            isWorkingWithUser : false,
            user_id_for_edit : 0,

            contentArray : [],
            count : 0,
            visitList : [],
            discountList : [],
            abonementPrivateList : [],
            userAdminDanceGroupList : [],
            modalDeleteUserIsShowing : false,
            modalEditUserIsShowing : false,

            dayOfWeek : "",
            schedule : []
        }

        this.search = this.search.bind(this);
        this.searchFromTop = this.searchFromTop.bind(this);
        this.filterFormListener = this.filterFormListener.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.searchPage = this.searchPage.bind(this);
        this.searchPageNext = this.searchPageNext.bind(this);
        this.searchPagePrev = this.searchPagePrev.bind(this);

        this.changeStateWorkingWithUser = this.changeStateWorkingWithUser.bind(this);
        this.refUserEditGetSearchPreview = React.createRef();

        ////////////////////////////////////////////

        this.changeFilter = this.changeFilter.bind(this);
        this.afterAddUser = this.afterAddUser.bind(this);

        this.get = this.get.bind(this);
        this.getUser = this.getUser.bind(this);

        this.modalDeleteUserOpen = this.modalDeleteUserOpen.bind(this);
        this.modalDeleteUserClose = this.modalDeleteUserClose.bind(this);
        this.afterDeleteUser = this.afterDeleteUser.bind(this);
        this.refreshUser = this.refreshUser.bind(this);

        //this.modalEditUserOpen = this.modalEditUserOpen.bind(this);
        //this.modalEditUserClose = this.modalEditUserClose.bind(this);
    }

    async componentDidMount(){
        await this.search();
    }




    changeFilter(){
        this.setState({
            activePage : 1
        }, () => {
            this.search();
        });
    }
    filterFormListener(e){
        this.setState({
            queryString : e.target.value,
            isNeedCount : true
        });
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.changeFilter();
        }
    }
    async search(){
        this.setState({isLoading : true});
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.userService.search(
            jwt, 
            this.state.activePage, 
            this.state.queryString, 
            this.state.isNeedCount
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success"){
            //this.props.addUserCallback();
            if(!this.state.isLaunch){
                this.setState({
                    isLaunch : true,
                    countUserSearchQueryAll : jsonAnswerStatus.countUserSearchQuery
                });
            }
            if(this.state.isNeedCount){
                let countPages = 0;
                if(jsonAnswerStatus.countUserSearchQuery !== 0){
                    countPages = Math.ceil(jsonAnswerStatus.countUserSearchQuery / 20)
                    //if(countPages === 0)countPages = 1;
                }
                this.setState({
                    countUserSearchQuery : jsonAnswerStatus.countUserSearchQuery,
                    countPages : countPages,
                    isNeedCount : false
                });
            }
            this.setState({
                userSearchPreviewViewModels : jsonAnswerStatus.userSearchPreviewViewModels
            });
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    searchFromTop(){
        this.setState({
            activePage : 1,
            isNeedCount : true
        }, async function(){
            //console.log("this.state.isNeedCount: " + this.state.isNeedCount);
            await this.search();
        });
    }
    searchPage(value){
        //console.log("searchPage");
        this.setState({
            activePage : value
        }, () => {
            this.search();
        });
    }
    searchPageNext(){
        if(this.state.activePage >= this.state.countPages)return;
        this.setState({
            activePage : this.state.activePage + 1
        }, () => {
            this.search();
        });
    }
    searchPagePrev(){
        if(this.state.activePage <= 1)return;
        this.setState({
            activePage : this.state.activePage - 1
        }, () => {
            this.search();
        });
    }

    get(user_id){
        this.setState({
            user_id : user_id
        }, () => {
            this.getUser(user_id);
        });
    }
    refreshUser(){
        this.getUser();
    }
    async getUser(user_id){
        this.setState({
            user_id_for_edit : user_id
        }, function(){
            this.changeStateWorkingWithUser(true);
        });
    }
    async changeStateWorkingWithUser(newValue){
        //console.log("changeStateWorkingWithUser");
        if(newValue){
            this.setState({
                isWorkingWithUser : newValue
            });
        } else {
            this.setState({
                isWorkingWithUser : newValue,
                user_id_for_edit : 0
            });
        }
    }




    modalDeleteUserOpen(id_of_user){
        this.setState({
            modalDeleteUserIsShowing : true,
            id_of_user : id_of_user
        });
    }
    modalDeleteUserClose(){
        this.setState({
            modalDeleteUserIsShowing : false
        });
    }
    afterDeleteUser(){
        this.setState({
            statusWorkWithUser : false
        }, () => {
            this.search();
        });
    }
    afterAddUser(id_of_user){
        this.search();
        this.setState({
            id_of_user : id_of_user
        }, () => {
            this.getUser();
        });
    }


    render(){

        let userSearchPreviews = <></>;
        if(this.state.isLoading){
            userSearchPreviews = <SystemLoadingPage />
        } else if(this.state.userSearchPreviewViewModels.length > 0){
            userSearchPreviews = this.state.userSearchPreviewViewModels.map((content, index) => {
                return <UserSearchPreviewRow
                key={index}
                id={content.id}
                secondname={content.secondname}
                firstname={content.firstname}
                telephone={content.telephone}
                date_of_add={content.date_of_add}
                date_of_last_visit={content.date_of_last_visit}
                getUser={this.getUser}
                />
            });
        } else {
            userSearchPreviews = <center><i>- записей не найдено -</i></center>
        }

        let isPaginationLeftEnabled = false;
        let pagePaginationMin = this.state.activePage;
        let isPaginationRightEnabled = false;
        let pagePaginationMax = this.state.activePage;
        if(this.state.activePage - 1 > 0){
            pagePaginationMin = this.state.activePage - 1;
        }
        if(this.state.activePage - 2 > 0){
            isPaginationLeftEnabled = true;
            pagePaginationMin = this.state.activePage - 2;
        }
        if(this.state.activePage + 1 < this.state.countPages){
            pagePaginationMax = this.state.activePage + 1;
        }
        if(this.state.activePage + 2 < this.state.countPages){
            isPaginationRightEnabled = true;
            pagePaginationMax = this.state.activePage + 2;
        }

        let paginationPages = [];
        for(var i = pagePaginationMin; i <= pagePaginationMax; i++){
            paginationPages.push(i);
            //paginationBtns += <li className={i === this.state.activePage ? "active" : ""}>{i}</li>
        }
        const paginationBtns = paginationPages.map((page) => {
            return <li key={page} className={page === this.state.activePage ? "active" : ""} onClick={() => this.searchPage(page)}>{page}</li>
        })

        //console.log("this.state.isWorkingWithUser: " + this.state.isWorkingWithUser);

        return(

            <div className="row page users">
                <div className={this.state.isWorkingWithUser ? "hide" : "col-3"}>
                    <div className="filter-global">
                        <p>Фильтрация</p>
                        <ul>
                            <li className="active">Все <span>{this.state.countUserSearchQueryAll}</span></li>
                        </ul>

                        <UserAddModal />

                    </div>
                </div>
                <div className={this.state.isWorkingWithUser ? "hide" : "col-9 right-block-preview-results"}>
                    <div className="col-12 row filter">
                        <div className="col-10">
                            <InputGroup>
                                <Form.Control type="text" placeholder="Поиск клиентов" maxLength="256"
                                onKeyDown={this.handleKeyDown}
                                onChange={this.filterFormListener} />
                            </InputGroup>
                        </div>
                        <div className="col-2">
                            <Button variant="success" 
                            onClick={this.searchFromTop} disabled={this.state.isLoading}>
                                Поиск
                            </Button>

                        </div>
                        <div className={this.state.isLoading ? "hide" : "col-12 results-pagination"}>
                            <p className="find">Найденное:</p>
                            <p className="find-count">{this.state.countUserSearchQuery} пользователей ({this.state.countPages} страниц)</p>
                            <ul>
                                <li className={isPaginationLeftEnabled ? "" : "disabled"}
                                onClick={this.searchPagePrev}><i className="fa fa-angle-left"></i></li>
                                {paginationBtns}
                                <li className={isPaginationRightEnabled ? "" : "disabled"}
                                onClick={this.searchPageNext}><i className="fa fa-angle-right"></i></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 row">

                        {userSearchPreviews}

                    </div>

                    <Modal
                    show={this.state.modalDeleteUserIsShowing}
                    onHide={this.modalDeleteUserClose}
                    animation={false}
                    size="lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Удалить пользователя</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Вы уверены, что хотите удалить пользователя?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="info" onClick={this.deleteUserFetch}>
                                Да
                            </Button>
                            <Button variant="secondary" onClick={this.modalDeleteUserClose}>
                                Закрыть окно
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                <div>
                    <div //User
                    //userModel = {this.state.userModel}
                    //returnToSearchPage = {this.returnToSearchPage}
                    //dayOfWeek = {this.state.dayOfWeek}
                    //schedule = {this.state.schedule}
                    //refreshUser = {this.refreshUser}
                    //userPurchaseList = {this.state.userPurchaseList}
                    //visitList = {this.state.visitList}
                    //discountList = {this.state.discountList}
                    //abonementPrivateList = {this.state.abonementPrivateList}
                    //userAdminDanceGroupList = {this.state.userAdminDanceGroupList}
                    //afterDeleteUser = {this.afterDeleteUser}
                    />
                </div>

                <div className={this.state.isWorkingWithUser ? "col-12 row" : "hide"}>
                    <div className="col-12">
                        <Button variant="danger" type="button" onClick={() => this.changeStateWorkingWithUser(false)}>Закрыть</Button>
                    </div>

                    <UserEditSubview
                    //ref={this.refUserEditGetSearchPreview}
                    key={this.state.user_id_for_edit}
                    user_id={this.state.user_id_for_edit}
                    />
                </div>

            </div>
        )
    }
}



export default function UsersPage(props){
    const navigate = useNavigate();
    return(<Users navigate={navigate}></Users>)
}