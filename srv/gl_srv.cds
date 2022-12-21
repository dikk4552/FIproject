using FIproject.gl from '../db/gl';

service GLservice {
entity GL as projection on gl.GL;
entity CoA as projection on gl.CoA;
entity CoCd as projection on gl.CoCd;
entity AcctGroup as projection on gl.AcctGroup;
entity History as projection on gl.History;
}