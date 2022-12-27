const rangeFilter = (field, rangeList) => {
  const res = {
    $or: rangeList.map((obj, idx) => {
      if (idx % 2 === 1) return;
      return {
        $and: [
          { [field]: { $gt: obj } },
          { [field]: { $lte: rangeList[idx + 1] } },
        ],
      };
    }),
  };
  return { $or: res.$or.filter((val) => val !== undefined) };
};

const rangeFilterV2 = (field, rangeList) => { /// data in db is range

  //  field[0] > minRange && field[0] < maxRange
  //   ||
  //  field[1] > minRange && field[0] < maxRange

  const res = {
    $or: rangeList.map((obj, idx) => {
      if (idx % 2 === 1) return;
      return {
        $or: [
          {
            $and: [
              { [field +'.0']: { $gte: obj } },
              { [field + '.0']: { $lte: rangeList[idx + 1] } },
            ]
          },
          {
            $and: [
              { [field + '.1']: { $gte: obj } },
              { [field + '.1']: { $lte: rangeList[idx + 1] } },
            ]
          },
        ]
      };
    }),
  };
  return { $or: res.$or.filter((val) => val !== undefined) };
};

const multipleValuesFilter = (field, valueList) => {
  const res = {
    $or: valueList.map((val) => {
      return { [field]: { $eq: val } };
    }),
  };
  return res;
};

const combineValuesFilter = (field, valueList) => {
  const res = {
    $and: valueList.map((val) => {
      return { [field]: { $eq: val } };
    }),
  };
  return res;
};

const combineFilter = (elements) => {
  if (!elements?.length) {
    return {};
  }
  const res = {
    $and: [...elements],
  };
  return res;
};

const multipleValuesInList = (field, valueList) => {
  const res = {
    [field]: {
      $elemMatch: {
        $in: [...valueList],
      },
    },
  };
  return res;
};

module.exports = {
  multipleValuesInList,
  rangeFilter,
  rangeFilterV2,
  multipleValuesFilter,
  combineValuesFilter,
  combineFilter,
};
