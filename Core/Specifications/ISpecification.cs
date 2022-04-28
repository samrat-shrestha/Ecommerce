using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public interface ISpecification<T>
    {
        //This is for the Where clause.
        Expression<Func<T, bool>> Criteria { get; }
        //Extra expressions other than Where like Include.
        List<Expression<Func<T, object>>> Includes { get; }
        Expression<Func<T, object>> OrderBy { get; }
        Expression<Func<T, object>> OrderByDescending { get; } 
        //Used to take how much data we need. For first group take = 5 and skip = none whereas for second list take = 5 and skip = 5
        int Take { get; }
        //Used to skip how many data in a list
        int Skip { get; }
        bool IsPagingEnabled { get; }
    }
}
