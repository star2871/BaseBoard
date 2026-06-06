/**
 * Fatigue Engine - Core logic for calculating player fatigue
 */

export const calculateFatigue = (position, activity) => {
  // Basic fatigue multipliers based on position
  const positionMultipliers = {
    'Pitcher': 1.5,
    'Catcher': 1.3,
    'Infield': 1.1,
    'Outfield': 1.0,
  };

  const multiplier = positionMultipliers[position] || 1.0;

  // Fatigue increase based on activity type
  const activityImpact = {
    'high_intensity': 5.0,
    'medium_intensity': 2.5,
    'low_intensity': 1.0,
  };

  const baseIncrease = activityImpact[activity] || 1.0;

  return baseIncrease * multiplier;
};

export const getFatigueLevel = (score) => {
  if (score >= 90) return 'Critical';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};
