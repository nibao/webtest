
"""
error code definition
"""

succeed = 0
''' finish successfully '''
unknown = 0xff000000
''' unknown error '''

"""
error code category
"""
category_common = 0xf0000000
category_user = 0xf1000000
category_collect = 0xf2000000
category_anyshare_server = 0xf3000000


"""
common error
"""
db_commit_failed = category_common + 0x1

token_fail_to_create = category_common + 0x110
token_illegal = category_common + 0x111

"""
anyshare server error
"""
anyshare_server_check_error = category_anyshare_server + 0x1
anyshare_server_file = category_anyshare_server + 0x2
anyshare_account_error = category_anyshare_server + 0x3
anyshare_account_info_error = category_anyshare_server + 0x4
anyshare_account_space_error = category_anyshare_server + 0x5
anyshare_get_docid_error = category_anyshare_server + 0x6
anyshare_create_floder_error = category_anyshare_server + 0x7
anyshare_upload_error = category_anyshare_server + 0x8
anyshare_check_file_error = category_anyshare_server + 0x20
anyshare_check_nofile_error = category_anyshare_server + 0x21

"""
user error
"""
user_unavailable = category_user + 0x1
user_fail_to_create = category_user + 0x2
user_fail_to_update = category_user + 0x3

"""
collect error
"""
collect_unavailable = category_collect + 0x1
collect_fail_to_create = category_collect + 0x2
collect_fail_to_query = category_collect + 0x3




