import { request } from "../utils/request";


export function getBlockAndTxList() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/blockAndTxList/${channelId}/0?from=Sat%20Jan%2001%202000%2019:00:00%20GMT+0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&&to=Fri%20Jan%2001%202100%2019:00:00%20GMT+0800%20(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)`, {}).then(res => res);
}

export function getBlocksByMonth() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/blocksByHour/${channelId}/30`, {}).then(res => res);
}

export function getBlocksByHour() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/blocksByHour/${channelId}/1`, {}).then(res => res);
}

export function getBlocksByMinute() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/blocksByMinute/${channelId}/1`, {}).then(res => res);
}


export function getChaincode() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/chaincode/${channelId}`, {}).then(res => res);
}

export function getChannelInfo() {
    return request("GET", `/api/channels/info`, {}).then(res => res);
}

export function getChannelStatus() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/status/${channelId}`, {}).then(res => res);
}

export function getPeersStatus() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/peersStatus/${channelId}`, {}).then(res => res);
}

export function getTxByOrg() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/txByOrg/${channelId}`, {}).then(res => res);
}

export function getTxByHour() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/txByHour/${channelId}/1`, {}).then(res => res);
}

export function getTxByMinute() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/txByMinute/${channelId}/1`, {}).then(res => res);
}

export function getTxDetail(txId) {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/transaction/${channelId}/${txId}`, {}).then(res => res);
}

export function getBlockActivity() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/blockActivity/${channelId}`, {}).then(res => res);
}

export function createCar(key,owner,make,model,color) {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/createCar/${key}/${owner}/${make}/${model}/${color}`, {}).then(res => res);
}

export function changeCarOwner(key, newOwner) {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/changeCarOwner/${key}/${newOwner}`, {}).then(res => res);
}

export function queryAllCars() {
    const channelId = JSON.parse(localStorage.getItem("channel")).channel_genesis_hash;
    return request("GET", `/api/queryAllCars`, {}).then(res => res.data);
}

