namespace Fanex.Affiliate.User.Core.DTO.UserPanel
{
    public class PlayerCPATurnOverItem
    {
        public int MemberCPAId { get; set; }    

        public int MemberCPATierId   { get; set;}

        public int GroupProductId {  get; set; }    

        public int ProductId { get; set; }  

        public string ProductName { get; set; }

        public decimal Turnover {  get; set; }

        public decimal CPAAmount { get; set; }  
    }
}
