namespace Fanex.Affiliate.User.Core.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Constants;

    public static class LinqExtensions
    {
        private static bool IsEqualIgnoreCase(string a, string b) 
            => string.Equals(a, b, StringComparison.InvariantCultureIgnoreCase);

        public static IEnumerable<T> FilterSpecialCountry<T>(this IEnumerable<T> source, Func<T, string> selector, string code)
        {
            if (!string.IsNullOrEmpty(code) && SystemLanguage.SpecialCountry.ContainsKey(code))
            {
                return source.Where(x => IsEqualIgnoreCase(selector(x), code));
            }

            return source.Where(x => !SystemLanguage.SpecialCountry.ContainsKey(selector(x)));
        }

        public static IEnumerable<T> FilterLanguageByCountry<T>(this IEnumerable<T> source, Func<T, string> selector, string code)
        {
            if (!string.IsNullOrEmpty(code) && SystemLanguage.SpecialCountry.TryGetValue(code, out var values))
            {
                var allowedLanguages = values
                    .Select(v => v.Language)
                    .Distinct()
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);
                
                return source.Where(x => allowedLanguages.Contains(selector(x)));
            }

            return source;
        }

        public static IEnumerable<T> FilterCurrencyByCountry<T>(this IEnumerable<T> source, Func<T, string> selector, string code)
        {
            if (!string.IsNullOrEmpty(code) && SystemLanguage.SpecialCountry.TryGetValue(code, out var values))
            {
                var allowedCurrencies = values
                    .Select(v => v.Currency)
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                return source.Where(x => allowedCurrencies.Contains(selector(x)));
            }

            var excludedCurrencies = SystemLanguage.SpecialCountry
                .SelectMany(kv => kv.Value.Select(v => v.Currency)
                    .Distinct())
                .Where(c => c != SystemLanguage.DefaultCurrencyCode)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            return source.Where(x => !excludedCurrencies.Contains(selector(x)));
        }
    }
}
