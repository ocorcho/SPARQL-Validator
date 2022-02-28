const core =  require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
        // take the input token for the action
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const pr_number = core.getInput('pr_number', { required: true });
        const token = core.getInput('token', { required: true });

        // Instance of Octokit to call the API
        const octokit = new github.getOctokit(token);
        
        // time of the action
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);

        const { data: changedFiles } = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: pr_number,
        });
        
        for (const file of changedFiles) {
            const fileExtension = file.filename.split('.').pop();
            console.log("bucle con file:: ", file)
        }

        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: pr_number,
            body: `
                Pull Request #${pr_number} has been updated with: \n
                - ${diffData.changes} changes \n
                - ${diffData.additions} additions \n
                - ${diffData.deletions} deletions \n
            `
        });

    }
    catch (error){
        core.setFailed(error.message);
    }
}

main();