namespace FIproject.doc;
entity Doc {
key Doc_number : String @title : '전표번호';
Doc_docdate : String @title : '증빙일';
Doc_postdate : String @title : '전기일';
Doc_cocd : String @title : '회사코드';
Doc_type : String @title : '전표유형';
Doc_curr : String @title : '통화';
Doc_text : String @title : '헤더텍스트';
Doc_ref : String @title : '참조';
Doc_D_acct : String @title : 'G/L';
Doc_D_amount : Integer @title : '금액';
Doc_D_cost : String @title : 'Cost Center';
Doc_D_prof : String @title : 'Profit Center';
Doc_C_acct : String @title : 'G/L';
Doc_C_amount : Integer @title : '금액';
Doc_C_cost : String @title : 'Cost Center';
Doc_C_prof : String @title : 'Profit Center';
Doc_duedate : String @title : '만기일';
}
