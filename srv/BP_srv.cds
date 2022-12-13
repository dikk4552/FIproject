using FIproject.bp from '../db/bp';

service BPservice {
entity BP as projection on bp.BP;
entity Region as projection on bp.Region;
entity PayTerm as projection on bp.PayTerm;
}
