using Fanex.Affiliate.Admin.Core.Commands.Apis;
using Fanex.Affiliate.Admin.Core.Services.Apis;
using Fanex.Data.Repository;
using Moq;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Services.Api
{
    public class ApiAffServiceTest
    {
        [Theory]
        [InlineData(false)]
        [InlineData(true)]
        public void InsertDataTracker_WhenCall_InsertSuccessfully(bool isDBNull)
        {
            // Arrange
            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(r => r.Execute(It.IsAny<InsertJobTrackerCommand>(), It.IsAny<string>())).Callback<INonQueryCommand, string>((c, _) => (c as InsertJobTrackerCommand).PushTrackerId = isDBNull ? 0 : 123);

            // Action
            var service = new ApiAffService(dynamicRepository.Object);
            var (Id, Result) = service.InsertDataTracker(new InsertJobTrackerCommand());

            // Assert
            Assert.Equal(isDBNull ? 0 : 123, Id);
            Assert.True(Result.IsSuccessful);
            dynamicRepository.Verify(d => d.Execute(It.Is<InsertJobTrackerCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
        }

        [Fact]
        public void UpdateDataTracker_WhenCall_UpdateSuccessfully()
        {
            // Arrange
            var dynamicRepository = new Mock<IDynamicRepository>();

            // Action
            var service = new ApiAffService(dynamicRepository.Object);
            var result = service.UpdateDataTracker(new UpdateJobTrackerCommand());

            // Assert
            Assert.True(result.IsSuccessful);
            dynamicRepository.Verify(d => d.Execute(It.Is<UpdateJobTrackerCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
        }
    }
}
