/**
 * Split Calculation Engine for SplitPay
 *
 * Guarantees mathematical exactness:
 * SUM(split amounts in paise) === original total in paise
 * Zero precision leakage, zero drift.
 */

import { toPaise } from './currency.js';

/**
 * Calculates an Equal Split divided into N parts.
 * Remainder paise are distributed evenly (+1 paise) across the initial parts.
 *
 * Example: ₹5,000 / 3 parts:
 * Total: 500000 paise
 * Base: 166666 paise (₹1,666.66)
 * Remainder: 2 paise
 * Part 1: 166667 paise (₹1,666.67)
 * Part 2: 166667 paise (₹1,666.67)
 * Part 3: 166666 paise (₹1,666.66)
 * Sum = 500000 paise (exact ₹5,000.00)
 *
 * If integer rupees are preferred when the amount has no cents:
 * For example ₹5,000 into 3 parts:
 * Part 1: ₹1,667
 * Part 2: ₹1,667
 * Part 3: ₹1,666
 *
 * @param {number} totalPaise - Total amount in integer paise
 * @param {number} partsCount - Positive integer >= 1
 * @returns {number[]} Array of integer paise amounts
 */
export function calculateEqualSplit(totalPaise, partsCount) {
  const parts = Math.max(1, Math.floor(Number(partsCount) || 1));
  if (totalPaise <= 0 || parts <= 0) return [];

  const basePart = Math.floor(totalPaise / parts);
  const remainder = totalPaise % parts;

  const result = [];
  for (let i = 0; i < parts; i++) {
    // Add 1 extra paise to the first `remainder` parts
    const partPaise = i < remainder ? basePart + 1 : basePart;
    result.push(partPaise);
  }

  return result;
}

/**
 * Calculates a Smart Split where no single part exceeds `maxAmountPerPart`.
 * Uses a deterministic greedy partition matching the required standard:
 * E.g., Total ₹5,000, Max ₹1,999:
 * Part 1: ₹1,999
 * Part 2: ₹1,999
 * Part 3: ₹1,002
 * Sum === ₹5,000
 *
 * @param {number} totalPaise - Total amount in integer paise
 * @param {number} maxPerPartPaise - Maximum amount per part in integer paise
 * @returns {number[]} Array of integer paise amounts
 */
export function calculateSmartSplit(totalPaise, maxPerPartPaise) {
  if (totalPaise <= 0 || maxPerPartPaise <= 0) return [];

  if (maxPerPartPaise >= totalPaise) {
    return [totalPaise];
  }

  const result = [];
  let remaining = totalPaise;

  while (remaining > 0) {
    if (remaining >= maxPerPartPaise) {
      result.push(maxPerPartPaise);
      remaining -= maxPerPartPaise;
    } else {
      result.push(remaining);
      remaining = 0;
    }
  }

  return result;
}

/**
 * Validates and analyzes a custom split breakdown.
 *
 * @param {number} totalPaise - Expected total in integer paise
 * @param {number[]} partsPaise - Array of individual part amounts in integer paise
 * @returns {{
 *   sumPaise: number,
 *   remainingPaise: number,
 *   isExact: boolean,
 *   isOver: boolean,
 *   isUnder: boolean,
 *   overByPaise: number
 * }}
 */
export function evaluateCustomSplit(totalPaise, partsPaise) {
  const safeParts = (partsPaise || []).map(p => Math.max(0, Math.round(p || 0)));
  const sumPaise = safeParts.reduce((acc, curr) => acc + curr, 0);
  const diff = totalPaise - sumPaise;

  return {
    sumPaise,
    remainingPaise: Math.max(0, diff),
    overByPaise: diff < 0 ? Math.abs(diff) : 0,
    isExact: diff === 0 && totalPaise > 0 && safeParts.length > 0,
    isOver: diff < 0,
    isUnder: diff > 0
  };
}

/**
 * Verification helper to assert SUM(parts) === total
 *
 * @param {number[]} partsPaise
 * @param {number} expectedTotalPaise
 * @returns {boolean}
 */
export function verifySplitIntegrity(partsPaise, expectedTotalPaise) {
  if (!Array.isArray(partsPaise) || partsPaise.length === 0) return false;
  const calculatedSum = partsPaise.reduce((acc, val) => acc + val, 0);
  return calculatedSum === expectedTotalPaise;
}
