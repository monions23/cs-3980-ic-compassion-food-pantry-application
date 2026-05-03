import Layout from "./Layout";

export default function Home_Logged_Out() {
  return (
    <Layout>
      <div className="main-grid">
        <div className="main-structure-top">
          <h1>Welcome to the IC Compassion Food Pantry Online Service!</h1>
          <hr />
          <h4>
            Our Food Pantry is open from <br /> 12:00 pm to 5:00 pm on
            Wednesdays.
          </h4>
        </div>
        <div className="main-structure-bottom">
          <h3>Please sign in to book an appointment.</h3>
          {/* <br /> */}
          {/* <div id="main-signup-button-container">
            <a href="signin-login.html" class="main-signup-button">
              Sign In Here
            </a>
          </div> */}
        </div>
      </div>
    </Layout>
  );
}
