namespace FIproject.gl;
entity GL {
key GL_number : String @title : 'G/L 계정'; 
GL_coa : String @title : '계정과목표';
GL_accttype : String @title : 'G/L 계정 유형';
GL_acctgroup : String @title : '계정 그룹';
GL_pltype : String @title : '손익계산서 계정 유형';
GL_function : String @title : '기능 영역';
GL_shorttext : String @title : '내역';
GL_longtext : String @title : 'G/L 계정 설명';
GL_deletion : Boolean @title : 'G/L 계정 삭제 표시';
GL_delreason : String @title : 'G/L 계정 삭제 사유';
}

entity CoA {
key CoA_number : String @title : '계정과목표';
CoA_name : String @title : '내역';
}

entity AcctGroup {
key AcctGroup_number : String @title : '계정그룹';
AcctGroup_coa : String @title : '계정과목표';
AcctGroup_name : String @title : '의미';
}

entity CoCd {
key CoCd_number : String @title : '회사코드';
CoCd_name : String @title : '회사이름';
CoCd_coarea : String @title : '관리회계영역';
CoCd_coa : String @title : '계정과목표';
CoCd_curr : String @title : '통화';
}

entity History {
key History_number : String @title : '변경이력번호';
History_table : String @title : '테이블명';
History_column : String @title : '컬럼명';
History_old : String @title : '변경전';
History_new : String @title : '변경후';
History_datetime : String @title : '변경일자';
}
