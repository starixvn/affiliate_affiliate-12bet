namespace Fanex.Affiliate.User.Core.CoreService
{
    using Commands;
    using Criterias;
    using Data.Repository;
    using DTO;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class BaseDynamicService
    {
        private readonly IDynamicRepository _dynamicRepository;

        public BaseDynamicService(IDynamicRepository dynamicRepository)
        {
            _dynamicRepository = dynamicRepository;
        }

        protected IDynamicRepository DynamicRepository => _dynamicRepository;

        public IEnumerable<T> FetchTData<T>(CriteriaBase criteria) where T : class
        {
            return _dynamicRepository.Fetch<T>(criteria);
        }

        public T GetTData<T>(CriteriaBase criteria) where T : class
        {
            return _dynamicRepository.Get<T>(criteria);
        }

        public (P,IEnumerable<T>) FetchMultipleTData<P, T>(CriteriaBase criteria) where T : class
        {
            var dataItems = _dynamicRepository.FetchMultiple<P, T>(criteria);

            return (dataItems.Item1.FirstOrDefault(), dataItems.Item2);
        }

        public IEnumerable<T> FetchTDataWithPaging<T>(PagingCriteria criteria, object param) where T : class
        {
            var result = _dynamicRepository.Fetch<T>(criteria);

            var paramType = param.GetType();
            SetPagingProperty(paramType, param, "NRows", criteria.NRows);

            return result;
        }

        public (P, IEnumerable<T>) FetchMultipleTDataWithPaging<P, T>(PagingCriteria criteria, object param) where T : class
        {
            var dataItems = _dynamicRepository.FetchMultiple<P, T>(criteria);

            var paramType = param.GetType();
            SetPagingProperty(paramType, param, "NRows", criteria.NRows);

            return (dataItems.Item1.FirstOrDefault(), dataItems.Item2);
        }

        private static void SetPagingProperty(Type paramType, object param, string propertyName, object value)
        {
            var property = paramType.GetProperty(propertyName);
            if (property != null && property.CanWrite)
            {
                property.SetValue(param, value);
            }
        }


        public void ExecuteCommand(NonQueryCommand command)
        {
            _dynamicRepository.Execute(command);
        }

        public ResultInfo ExecuteReturnResultInfo(BaseNonQueryCommand command)
        {
            _dynamicRepository.Execute(command);

            return new ResultInfo
            {
                IsOk = command.ErrCode == 0,
                Code = command.ErrCode,
                Message = command.ErrMsg
            };
        }

        public EntityResult<T> FetchEntityResult<T>(CriteriaBase criteria) where T : class
        {
            var (dataList, totalItem) = _dynamicRepository.FetchMultiple<T, T>(criteria);

            return new EntityResult<T>
            {
                MainDataList = dataList,
                Total = totalItem.FirstOrDefault()
            };
        }

        public EntityResult<T> FetchEntityResultWithPaging<T>(PagingCriteria criteria) where T : class
        {
            var (dataList, totalItem) = _dynamicRepository.FetchMultiple<T, T>(criteria);

            return new EntityResult<T>
            {
                MainDataList = dataList,
                Total = totalItem.FirstOrDefault(),
                TotalItem = criteria.NRows
            };
        }

        public MultipleEntityResult<T> FetchMultipleEntityResult<T>(CriteriaBase criteria) where T : class
        {
            var (firstDataList, secondDataList,  totalItem) = _dynamicRepository.FetchMultiple<T, T, T>(criteria);

            return new MultipleEntityResult<T>
            {
                FirstDataList = firstDataList,
                SecondDataList = secondDataList,
                Total = totalItem.FirstOrDefault()
            };
        }
    }
}
