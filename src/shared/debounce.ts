/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Returns a new function that will call the wrapped function
 * after the specified delay. If the function is called again
 * within the delay, the timer will be reset.
 * @param func The function to wrap
 * @param delay The delay in milliseconds
 */
export function debounce<T extends Function>(func: T, delay = 300): T {
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => { func(...args); }, delay);
    } as any;
}

/**
 * Returns an array of 2 functions. The first function will call the wrapped
 * function after the specified delay. If that first function is called again
 * within the delay, the timer will be reset. The second function will stop
 * the wrapped function from being called after the delay. The first function
 * may continue the delay after the second cancel function.
 * @param func The function to wrap
 * @param delay The delay in milliseconds
 */
export function clearableDebounce<T extends Function>(func: T, delay = 300): T[] {
    let timeout: NodeJS.Timeout;
    return [function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => { func(...args); }, delay);
    } as any, function () {
        clearTimeout(timeout);
    }];
}
