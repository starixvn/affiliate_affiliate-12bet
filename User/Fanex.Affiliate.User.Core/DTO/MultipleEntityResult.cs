using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.DTO
{
    public class MultipleEntityResult<T> where T : class
    {
        public IEnumerable<T> FirstDataList { get; set; }

        public IEnumerable<T> SecondDataList { get; set; }

        public T Total { get; set; }
    }
}
