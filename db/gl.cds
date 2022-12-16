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
