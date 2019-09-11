import request from '@/plugins/axios'

export function getWOInfos(){
	return request({url: `webApi/api/Default/GetWOInfos`,method:'post',}).then(res => {
		return res.data
	})}

export function getWOInfo(params){
	return request({url: `webApi/api/Default/GetWOInfo`,method:'post',params}).then(res => {
		return res.data
	})}

export function getCurrentBatchInfo(params){
	return request({url: `webApi/api/Default/GetCurrentBatchInfo`,method:'post',params}).then(res => {
		return res.data
	})}

export function firstLoading(params){
	return request({url: `webApi/api/Default/FirstLoading`,method:'post',params}).then(res => {
		return res.data
	})}

export function onOrOffSubmit(params){
	return request({url: `webApi/api/Default/Loading`,method:'post',params}).then(res => {
		return res.data
	})}

export function changeBatchStatus(params){
	return request({url: `webApi/api/Default/ChangeBatchStatus`,method:'post',params}).then(res => {
		return res.data
	})}

export function getIsoLation(params){
	return request({url: `webApi/api/Default/GetIsoLation`,method:'post',params}).then(res => {
		return res.data
	})}

export function getBatchBadInfos(params){
	return request({url: `webApi/api/Default/GetBatchBadInfos`,method:'post',params}).then(res => {
		return res.data
	})}

export function getWOAndBatchInfos(params){
	return request({url: `webApi/api/Default/GetWOAndBatchInfos`,method:'post',params}).then(res => {
		return res.data
	})}

export function repair(params){
	return request({url: `webApi/api/Default/Repair`,method:'post',params}).then(res => {
		return res.data
	})}

export function batchReplace(params){
	return request({url: `webApi/api/Default/Replace`,method:'post',params}).then(res => {
		return res.data
	})}

export function getReplaceInfos(params){
	return request({url: `webApi/api/Default/GetReplaceInfos`,method:'post',params}).then(res => {
		return res.data
	})}






