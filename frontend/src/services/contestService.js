import axios from 'axios';

export const getCodeforcesContests = async () => {
    const response = await axios.get('http://localhost:8000/api/contests/codeforces');
    return response.data;
};