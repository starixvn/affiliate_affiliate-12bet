import React, { PureComponent } from "react";
import { post } from '../../../modules/ajaxRequest';
import { Col, FormGroup, Label, Button, Alert } from 'reactstrap';
import { messages, popupEventNames } from '../deal/libs/constants';
import { htmlDecode } from '../../../modules/htmlHelper';
import Loader from '../../../components/Loader';

const REVENUE_DEAL_TYPE = 1;

export default class AssignDeal extends PureComponent {
    constructor(props) {
        super(props);

        let { dealTypeList, dealList, affInfo } = window.initialState;

        let selectedDealType = affInfo.GroupTypeId;

        const dealByType = dealList.filter(item => item.GroupTypeId === selectedDealType);

        let selectedDeal =
            dealByType.find(item => item.GroupId === affInfo.GroupId)?.GroupId
            ?? dealByType[0]?.GroupId
            ?? 0;

        this.state = Object.assign({}, { dealTypeList, dealList, dealByType, selectedDeal, selectedDealType, affInfo }, {
            isShowLoader: false,
            isShowMessage: false,
            isSuccess: true,
            message: ''
        });
    }

    handleChangeDealType = (event) => {
        const { value } = event.target;

        const { dealList, affInfo } = this.state;

        const newDealByType = dealList.filter(item => item.GroupTypeId === Number(value));
        const newSelectedDeal = newDealByType && newDealByType.length ? newDealByType.find(d => d.GroupId === affInfo.GroupId) : 0;

        this.setState({
            selectedDealType: Number(value),
            selectedDeal: newSelectedDeal ? affInfo.GroupId : newDealByType[0].GroupId,
            dealByType: newDealByType
        });
    }

    handleChangeDeal = (event) => {
        const { value } = event.target;
        this.setState({ selectedDeal: Number(value) });
    }

    handleSave = async () => {
        const { affInfo, selectedDeal } = this.state;

        if (affInfo.GroupId > 0 && affInfo.GroupId === selectedDeal) {
            this.setState({
                isShowMessage: true,
                isSuccess: false,
                message: messages.choseAnotherDeal
            }, () => window.setTimeout(this.hideMessage, 3000));
            return;
        }

        this.setState({ isShowLoader: true });
        const url = 'Portal/DealAssignment/AssignDeal';
        const params = {
            assignParam: {
                groupId: selectedDeal,
                affId: affInfo.AffId
            },
            affInfo
        }
        const response = await post(url, params);
        if (response && response.status === 200) {
            const result = response.data;

            this.setState({
                isShowMessage: true,
                isSuccess: result.IsSuccessful,
                message: result.IsSuccessful ? messages.assignDealSuccessfully : result.Message
            }, () => window.setTimeout(() => {
                this.hideMessage();
                result.IsSuccessful && parent.postMessage(popupEventNames.assignDealSuccessfully, window.location.origin);
            }, 3000));
        }

        this.setState({ isShowLoader: false });
    }

    hideMessage = () => {
        this.setState({
            isShowMessage: false
        });
    }

    render() {
        const { dealTypeList, dealByType, selectedDeal, selectedDealType, affInfo, isShowLoader, isShowMessage, isSuccess, message } = this.state;
        return affInfo && (
            <div className="assign-normal-group" style={{ padding: 10 }}>
                <Loader show={isShowLoader} />
                <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                    <div dangerouslySetInnerHTML={{ __html: message }}></div>
                </Alert>
                <fieldset>
                    <legend><h6 className="font-weight-bold">Assignee</h6></legend>
                    <p>{affInfo.UserName}</p>
                </fieldset>
                <fieldset>
                    <legend><h6 className="font-weight-bold">Deal</h6></legend>
                    <FormGroup row>
                        <Label xs="4" className="font-weight-bold">Deal Type </Label>
                        <Col xs="5" className="select-comm">
                            <select name="selectedDealType" className="form-control" onChange={this.handleChangeDealType} value={selectedDealType}>
                                {
                                    dealTypeList && dealTypeList.map((item, index) => {
                                        return (<option key={`deal-type-${index}`} value={item.GroupTypeId}>{htmlDecode(item.GroupTypeName)}</option>)
                                    })
                                }
                            </select>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label xs="4" className="font-weight-bold">Deal Name </Label>
                        <Col xs="5" className="select-comm">
                            <select name="selectedDeal" className="form-control" onChange={this.handleChangeDeal} value={selectedDeal}>
                                {
                                    dealByType && dealByType.map((item, index) => {
                                        return (<option key={`deal-${index}`} value={item.GroupId}>{htmlDecode(item.GroupName)}</option>)
                                    })
                                }
                            </select>
                        </Col>
                    </FormGroup>
                </fieldset>
                <p className="text-danger">Note: Change will take effect on current month (GMT-4).</p>
                <Button type="button" className="my-2 btn btn-success" onClick={this.handleSave}>SAVE</Button>
            </div>
        );
    }
}