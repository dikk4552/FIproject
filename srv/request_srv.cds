using FIproject.request from '../db/request';

service  RequestService {

    entity Request as projection on request.Request;
    entity Request_State as projection on request.Request_State;

}