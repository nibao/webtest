import time
import uuid
import interfaces.technical.error
import json

import requests
import math
import StringIO


class AnyShareAPI(object):
    # def __init__(self, server_address, right_port, file_port, account, password):
    #     self.server_address = server_address
    #     self.right_port = right_port
    #     self.file_port = file_port
    #     self.account = account
    #     self.password = password

    def get_server_ping(self, server_address, right_port, file_port):
        try:

            #right server check
            url1 = "http://%s/v1/ping" % (server_address + ":" + right_port)
            # http post module
            # urllib2.urlopen(url1, "")
            requests.post(url1)
            #document server check
            url2 = "http://%s/ping" % (server_address + ":" + file_port)
            # urllib2.urlopen(url2, "")
            requests.post(url2)
            return True
        except:
            return False

    def get_user_login(self, server_address, right_port, account, password):
        try:
            url = "http://%s/v1/auth?method=get" \
                  % (server_address + ":" + right_port)
            data = {}
            data['account'] = account
            data['password'] = password
            body = json.dumps(data)
            res = requests.post(url, body)
            res = res.text
            try:
                return json.loads(res)
            except KeyError:
                ''' unknown error '''
                return interfaces.technical.error.unknown
        except:
            return interfaces.technical.error.anyshare_account_error

    # this method not use
    def get_user_info(self, server_address, right_port, userid, tokenid):
        try:
            url = "http://%s/v1/user?method=get&userid=%s&tokenid=%s" \
                  % (server_address + ":" + right_port, userid, tokenid)
            res = requests.post(url)
            res = res.text
            res = json.loads(res)
            if res and 'account' in res:
                return res['account']
            return None
        except:
            return interfaces.technical.error.anyshare_account_info_error

    def get_user_spaces(self, server_address, right_port, userid, tokenid):
        try:
            url = "http://%s/v1/quota?method=getuserquota&userid=%s&tokenid=%s" \
                  % (server_address + ":" + right_port, userid, tokenid)
            res = requests.post(url)
            res = res.text
            res = json.loads(res)
            userinfos = {}
            for temp in res['quotainfos']:
                if temp['doctype'] == "userdoc":
                    userinfos["quota"] = round(temp['quota']/float(1024*1024*1024), 3)
                    userinfos["used"] = round(temp['used']/float(1024*1024*1024), 3)
            return userinfos
        except:
            return interfaces.technical.error.anyshare_account_info_error

    def _get_user_document_docid(self, server_address, right_port, userid, tokenid):
        try:
            url = "http://%s/v1/entrydoc?method=get&userid=%s&tokenid=%s" \
                  % (server_address + ":" + right_port, userid, tokenid)
            res = requests.post(url)
            res = res.text
            res = json.loads(res)
            docinfo = res['docinfos']
            for temp in docinfo:
                if temp['doctype'] == "userdoc":
                    return temp['docid']
        except:
            return interfaces.technical.error.anyshare_get_docid_error

    def _get_user_doc_if_has_wechat(self, server_address, file_port, docid, userid, tokenid):
        try:
            url = "http://%s/v1/dir?method=list&userid=%s&tokenid=%s" \
                  % (server_address + ":" + file_port, userid, tokenid)
            body = {}
            body["docid"] = docid
            data = json.dumps(body)
            res = requests.post(url, data)
            res = res.text
            res = json.loads(res)
            return res
        except:
            return interfaces.technical.error.anyshare_get_docid_error

    def create_floder(self, server_address, right_port, file_port,  userid, tokenid, folder_name):
        try:
            url = "http://%s/v1/dir?method=create&userid=%s&tokenid=%s" \
                  % (server_address + ":" + file_port, userid, tokenid)
            # req = urllib2.Request(url)
            name = folder_name #"Anyshare_Wechat" #interfaces.technical.anyshare_config.anyshare_folder#.decode('utf-8') #
            # get user document docid
            docid = self._get_user_document_docid(server_address,
                                                    right_port,
                                                    userid,
                                                    tokenid)

            body = {}
            body['docid'] = docid
            body['name'] = name
            body = json.dumps(body, ensure_ascii=False)
            # req.add_data(json.dumps(body))
            # if there is a folder named Anyshare_Wechat
            ret = self._get_user_doc_if_has_wechat(
                    server_address, file_port, docid, userid, tokenid)
            create = False
            if ret and ret['dirs']:
                for temp in ret['dirs']:
                    if temp['name'].encode('utf-8') == name.encode('utf-8'):
                        create = True
            # no Anyshare_Wechat folder then created
            if not create:
                # res = urllib2.urlopen(req).read()
                res = requests.post(url, body.encode('utf-8')).text
                res = json.loads(res)
                if res and res['docid'] and res['rev']:
                    return res['docid']
                else:
                    return False
        except:
            return interfaces.technical.error.anyshare_create_floder_error

    def _struct_request_data(self, filestr, boundary, filename, datajson):
        try:
            body1 = []
            body1.append('--')
            body1.append(boundary)
            body1.append('\r\n')
            body1.append('Content-Disposition: form-data; name="upload";')
            body1.append('filename="%s"' % filename)
            body1.append('\r\n')
            body1.append('Content-Type: application/octet-stream')
            body1.append('\r\n')
            body1.append('\r\n')
            body1.append(filestr)
            body1.append('\r\n')
            body1.append('--')
            body1.append(boundary)
            body1.append('\r\n')
            body1.append('Content-Disposition: form-data; name="json"')
            body1.append('\r\n')
            body1.append('Content-Type: text/plain; charset=utf-8')
            body1.append('\r\n')
            body1.append('\r\n')
            body1.append(datajson)
            body1.append('\r\n')
            body1.append('\r\n')
            body1.append('--')
            body1.append(boundary)
            body1.append('\r\n')
            # set body
            body2 = "".join(body1)
            return body2
        except:
            return None

    # request for anyshare method
    def _http_request_method(self, boundary, url, body):
        try:
            # request method to upload files
            heads = {'Content-Type': 'multipart/form-data;boundary=%s' % boundary}
            try:
                body = body.encode('utf-8')
            except:
                body = body
            res = requests.post(url, body, headers=heads)
            res = res.text
            res = json.loads(res)
            return res
        except:
            return None

    # def upload_files(self):
    def upload_files(self, server_address, right_port, file_port, account, password, filestr, file_name, file_type, folder_name):
        try:
            #get userid and tokenid
            login = self.get_user_login(server_address, right_port, account, password)
            userid = login['userid']
            tokenid = login['tokenid']
            # get user document docid
            docid = self._get_user_document_docid(server_address,
                                                    right_port,
                                                    userid,
                                                    tokenid)
            # get user document Anyshare_Wechat docid
            # if there is a folder named Anyshare_Wechat
            ret = self._get_user_doc_if_has_wechat(
                    server_address, file_port, docid, userid, tokenid)
            create = False
            wedocid = ""
            if ret and ret['dirs']:
                for temp in ret['dirs']:
                    if temp['name'].encode('utf-8') == folder_name.encode('utf-8'): #"Anyshare_Wechat": #interfaces.technical.anyshare_config.anyshare_folder.decode('utf-8'): #
                        wedocid = temp['docid']
                        create = True
            # no Anyshare_Wechat folder then created
            if not create:
                wedocid = self.create_floder(server_address, right_port, file_port,  userid, tokenid, folder_name)
                if not wedocid:
                    return False

            # upload files ( by block)
            url = "http://%s/v1/file?method=upload&userid=%s&tokenid=%s" \
                  % (server_address + ":" + file_port, userid, tokenid)
            if file_name is None:
                filename = str(time.strftime('%Y_%m_%d_%H_%M_%S') + file_type)
            else:
                filename = file_name + file_type
            temp_file = StringIO.StringIO(filestr)
            # check block number
            block_number = int(math.ceil(temp_file.len / float(1024 * 1024)))
            # file length less 1M
            if block_number == 1:
                # file length less 1M
                filestr = temp_file.read()
                datajson = {}
                datajson['client_mtime'] = int(time.time())
                datajson['docid'] = wedocid
                datajson['length'] = len(filestr)
                datajson['more'] = False
                datajson['name'] = filename
                datajson['sn'] = 0
                datajson = json.dumps(datajson, ensure_ascii=False)
                if ".html" in filename:
                    pass
                else:
                    datajson = datajson.encode('utf-8')
                boundary = str(uuid.uuid4())
                body = self._struct_request_data(filestr, boundary, filename, datajson)
                res = self._http_request_method(boundary, url, body)
                if res and res['rev']:
                    pass
                else:
                    return False
            # upload file by blocks
            else:
                # first: upload the first block
                content0 = temp_file.read(1024 * 1024)
                datajson = {}
                datajson['client_mtime'] = int(time.time())
                datajson['docid'] = wedocid
                datajson['length'] = len(content0)
                datajson['more'] = True
                datajson['name'] = filename
                datajson['sn'] = 0
                datajson = json.dumps(datajson, ensure_ascii=False)
                if ".html" in filename:
                    pass
                else:
                    datajson = datajson.encode('utf-8')
                boundary = str(uuid.uuid4())
                body = self._struct_request_data(content0, boundary, filename, datajson)
                res = self._http_request_method(boundary, url, body)
                if res and res['rev']:
                    pass
                else:
                    return False
                updocid = res['docid']
                rev = res['rev']
                # second: continue to upload other blocks
                for i in range(1, block_number + 1):
                    if i == block_number:
                        filesize = temp_file.len - 1024 * 1024 * (block_number - 1)
                        contenti = temp_file.read(filesize)
                    else:
                        contenti = temp_file.read(1024 * 1024)
                    datajson = {}
                    datajson['client_mtime'] = int(time.time())
                    datajson['docid'] = updocid
                    datajson['length'] = len(contenti)
                    more = True
                    if i == block_number:
                        more = False
                    datajson['more'] = more
                    datajson['sn'] = i
                    datajson['rev'] = rev
                    datajson = json.dumps(datajson, ensure_ascii=False)
                    if ".html" in filename:
                        pass
                    else:
                        datajson = datajson.encode('utf-8')
                    boundary = str(uuid.uuid4())
                    body = self._struct_request_data(contenti, boundary, filename, datajson)
                    res = self._http_request_method(boundary, url, body)
                    if res and res['rev']:
                        pass
                    else:
                        return False
            return True
        except:
            return interfaces.technical.error.anyshare_upload_error

    def _get_file_links(self, server_address, file_port, docid, userid, tokenid):
        try:
            url = "http://%s/v1/link?method=getdetail&userid=%s&tokenid=%s" \
                  % (server_address + ":" + file_port, userid, tokenid)
            body = {}
            body["docid"] = docid
            body = json.dumps(body)
            res = requests.post(url, body)
            res = res.text
            res = json.loads(res)
            if res and res['link']:
                return res
            else:
                return None
        except:
            return None

    def _open_file_link(self, server_address, file_port, docid, userid, tokenid):
        try:
            url = "http://%s/v1/link?method=open&userid=%s&tokenid=%s" \
                  % (server_address + ":" + file_port, userid, tokenid)
            body = {}
            body["docid"] = docid
            body = json.dumps(body)
            res = requests.post(url, body)
            res = res.text
            res = json.loads(res)
            if res and res['link']:
                return res
            else:
                return None
        except:
            return None

    # get web client
    def _get_webclient_info(self, server_address, right_port, userid, tokenid):
        try:
            url = "http://%s/v1/redirect?method=gethostinfo&userid=%s&tokenid=%s" \
                  % (server_address + ":" + right_port, userid, tokenid)
            body = {}
            body = json.dumps(body)
            res = requests.post(url, body)
            res =res.text
            res = json.loads(res)
            if res and res['host']:
                return res
            else:
                return None
        except:
            return None

    # create file url
    def _create_files_url(self, server_address, right_port, file_port, userid, tokenid, docid):
        try:
            get_link = self._get_file_links(server_address, file_port, docid, userid, tokenid)
            if get_link is not None and 'link' in get_link:
                link = get_link['link']
            else:
                createlink = self._open_file_link(server_address, file_port, docid, userid, tokenid)
                link = createlink['link']
            serverinfo = self._get_webclient_info(server_address, right_port, userid, tokenid)
            create_url = 'http://' + serverinfo['host'] + ':' + str(serverinfo['port']) + '/link/' + link
            return create_url
        except:
            return None

    def download_html_files(self, server_address, right_port, file_port, account, password, docid):
        try:
            #get userid and tokenid
            login = self.get_user_login(server_address, right_port, account, password)
            userid = login['userid']
            tokenid = login['tokenid']
            # down html files
            url = "http://%s/v1/file?method=download&userid=%s&tokenid=%s" \
                  % (server_address + ":" + file_port, userid, tokenid)
            body = {}
            body["docid"] = docid
            body["sn"] = 0
            data = json.dumps(body)
            rec = requests.post(url, data)
            res = rec.text
            #get the boundary
            boundary = rec.headers['content-type'].split('=')[-1]
            #get html content
            html_content = res.split('--' + boundary + '\r\n\r\n')[1]
            url = html_content.split('document.location.href ="')[-1].split('"')[0]
            return url
        except:
            return None

    # get documents collected links
    def get_document_links(self, server_address, right_port, file_port, account, password, folder_name):
        try:
            #get userid and tokenid
            login = self.get_user_login(server_address, right_port, account, password)
            userid = login['userid']
            tokenid = login['tokenid']
            # get user document docid
            docid = self._get_user_document_docid(server_address,
                                                    right_port,
                                                    userid,
                                                    tokenid)
            # get user document Anyshare_Wechat docid
            # if there is a folder named Anyshare_Wechat
            ret = self._get_user_doc_if_has_wechat(
                    server_address, file_port, docid, userid, tokenid)
            create = False
            wedocid = ""
            if ret and ret['dirs']:
                for temp in ret['dirs']:
                    if temp['name'].encode('utf-8') == folder_name.encode('utf-8'):#"Anyshare_Wechat":#interfaces.technical.anyshare_config.anyshare_folder.decode('utf-8'):#
                        wedocid = temp['docid']
            else:
                # interfaces.technical.error.anyshare_check_nofile_error
                return None
            if wedocid == "":
                return None
            # get all files(html,mp3,mp4,png) in the folder
            recvdoc = self._get_user_doc_if_has_wechat(
                server_address, file_port, wedocid, userid, tokenid)
            collect_files = []
            if recvdoc and recvdoc['files']:
                for temp in recvdoc['files']:
                    file_docid = temp["docid"]
                    # get file links
                    link_url = self._create_files_url(server_address, right_port, file_port, userid, tokenid, file_docid)
                    # get the html links
                    if temp["name"].split('.')[-1] == 'html':
                        link_url = self.download_html_files(server_address, right_port, file_port, account, password, file_docid)
                    collect_file = {"client_mtime": temp["client_mtime"],
                                    "docid": file_docid,
                                    "name": temp["name"],
                                    "url": link_url}
                    collect_files.append(collect_file)
            # order by collected time
            collect_files.sort(key=lambda x: x['client_mtime'], reverse=True)
            return collect_files
        except:
            return interfaces.technical.error.anyshare_check_file_error

    # def get_document_manage(self, server_address, right_port, userid, tokenid):
    #     try:
    #         url = "http://%s/v1/managedoc?method=get&userid=%s&tokenid=%s" \
    #               % (server_address + ":" + right_port,
    #                  userid, tokenid)
    #         res = urllib2.urlopen(url).read()
    #         return json.loads(res)
    #     except:
    #         return None