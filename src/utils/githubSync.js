/**
 * Utility to sync dashboard properties with a JSON file in the GitHub repository.
 */

const GITHUB_REPO = "-Commercial-Solar-Installation-Smart-Spreadsheet-Dashboard";
const GITHUB_OWNER = "two3four"; // As seen in previous logs
const FILE_PATH = "data/properties.json";

/**
 * Fetches the current properties from the GitHub repo.
 * @param {string} token - GitHub Personal Access Token
 */
export const fetchFromGitHub = async (token) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

        if (response.status === 404) return []; // File doesn't exist yet
        if (!response.ok) throw new Error('Failed to fetch from GitHub');

        return await response.json();
    } catch (error) {
        console.error("GitHub Fetch Error:", error);
        return null;
    }
};

/**
 * Saves properties to the GitHub repo.
 * @param {string} token - GitHub Personal Access Token
 * @param {Array} properties - The properties array to save
 */
export const saveToGitHub = async (token, properties) => {
    try {
        // 1. Get the current file SHA (required for updates)
        const getFileResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
            headers: { 'Authorization': `token ${token}` }
        });

        let sha = null;
        if (getFileResponse.ok) {
            const fileData = await getFileResponse.json();
            sha = fileData.sha;
        }

        // 2. Update/Create the file
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(properties, null, 2))));

        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Sync: Update property data",
                content: content,
                sha: sha
            })
        });

        return response.ok;
    } catch (error) {
        console.error("GitHub Save Error:", error);
        return false;
    }
};
