namespace FIproject.bp;

using{
    cuid, managed, Currency, Country
} from '@sap/cds/common';

entity BP {
key BP_number : String @title : 'BP 번호';
BP_category : String @title : 'BP 카테고리';
BP_name : String @title : 'BP 이름';
BP_title : String @title : '개인칭호';
BP_street : String @title : '도로주소';
BP_house : String @title : '번지';
BP_zipcode : String @title : '우편번호';
BP_city : String @title : '도시';
BP_country : String @title : '국가/지역';
BP_language : String @title : '언어';
BP_cocd : String @title : '회사코드';
BP_payterm : String @title : '지급조건';
BP_manager : String @title : '담당자';
BP_createdate : String @title : '생성일자';
BP_estdate : String @title : '생일/설립일';
BP_tin : String @title : '사업자등록번호';
BP_industry : String @title : '업종';
BP_phone : String @title : '전화번호';
BP_fax : String @title : '팩스';
BP_email : String @title : '이메일';
BP_website : String @title : '웹사이트';
};

entity Region {
key Reg_number : String @title : '국가/지역 코드';
Reg_name : String @title : '국가/지역 이름';
};

entity PayTerm {
key PayTerm_number : String @title : '지급조건';
PayTerm_accttype : String @title : '계정유형';
PayTerm_duedate : Integer @title : '만기일';
PayTerm_text : String @title : '설명';
};