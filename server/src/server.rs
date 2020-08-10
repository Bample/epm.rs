extern crate base64;
extern crate chrono;
extern crate console;
extern crate proctitle;
extern crate redis;
#[macro_use]
extern crate lazy_static;
use base64::{decode, encode};
use chrono::prelude::*;
use console::style;
use epm::basic_server::{Basic, BasicServer};
use epm::{GetInfoResponse, SearchRequest, SearchResponse, StatusResponse};
use redis::Commands;
use std::collections::HashMap;
use std::sync::*;
use tonic::{transport::Server, Request, Response, Status};

const redis_url: &str = "redis://127.0.0.1:6379/";
const bind_addr: &str = "[::1]:6712";
const server_name: &str = "test";
const version: &str = "1.0.3";

lazy_static! {
  static ref DBPOOL_1: Arc<Mutex<redis::Client>> = Arc::new(Mutex::new(
    redis::Client::open(format!("{}1", redis_url)).unwrap()
  ));
}

lazy_static! {
  static ref DBPOOL_2: Arc<Mutex<redis::Client>> = Arc::new(Mutex::new(
    redis::Client::open(format!("{}2", redis_url)).unwrap()
  ));
}

pub mod epm {
  tonic::include_proto!("epm"); // The string specified here must match the proto package name
}

#[derive(Debug, Default)]
pub struct Services {}

#[tonic::async_trait]
impl Basic for Services {
  async fn get_status(
    &self,
    request: Request<epm::None>, // Accept request of type HelloRequest
  ) -> Result<Response<StatusResponse>, Status> {
    // Return an instance of type HelloReply
    println!("\n{}\n{:#?}", style("New Connection!").cyan(), request);
    let reply = StatusResponse {
      // message: format!("Hello {}!", request.into_inner().name).into(), // We must use .into_inner() as the fields of gRPC requests and responses are private
      status: "OK".to_string(),
      code: 200,
      request_time: Utc::now().to_rfc3339(),
    };

    Ok(Response::new(reply)) // Send back our formatted greeting
  }
  async fn get_info(
    &self,
    request: Request<epm::None>, // Accept request of type HelloRequest
  ) -> Result<Response<GetInfoResponse>, Status> {
    // Return an instance of type HelloReply
    println!("\n{}\n{:#?}", style("New Connection!").cyan(), request);
    let reply = GetInfoResponse {
      // message: format!("Hello {}!", request.into_inner().name).into(), // We must use .into_inner() as the fields of gRPC requests and responses are private
      server_name: server_name.to_string(),
      server_version: version.to_string(),
      store_engine: "redis".to_string(),
      request_time: encode(Utc::now().to_rfc3339()),
    };

    Ok(Response::new(reply)) // Send back our formatted greeting
  }
  async fn search_package_by_name(
    &self,
    request: Request<SearchRequest>,
  ) -> Result<Response<SearchResponse>, Status> {
    println!("\n{}\n{:#?}", style("New Connection!").cyan(), request);
    let rclient = (*DBPOOL_1).lock().unwrap();
    let mut conn = rclient.get_connection().unwrap();
    let tval: Vec<String> = conn.keys(request.into_inner().pattern).unwrap();
    Ok(Response::new(SearchResponse {
      result: tval,
      request_time: encode(Utc::now().to_rfc3339()),
    }))
  }
}

async fn dbtest() -> Result<(), Box<dyn std::error::Error>> {
  let rclient = (*DBPOOL_1).lock().unwrap();
  let mut conn = rclient.get_connection()?;
  let hk: Vec<String> = conn.hkeys("TestA1pp")?;
  let mut kk: Vec<String> = Vec::new();
  for i in &hk {
    kk.push(conn.hget("TestA1pp", i)?);
  }
  let yy: HashMap<_, _> = hk.iter().zip(kk.iter()).collect();
  println!("{:#?}", yy.get(&"id".to_string()));
  Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  proctitle::set_title("EPM (Server-side)");

  println!(
    "{}",
    style(format!(
      "Edgeless Package Manager (Server-side) v{}",
      version
    ))
    .cyan()
    .bold()
  );
  // dbtest().await?;
  println!("{} {}", style("Server Name:").green().italic(), server_name);
  println!("{} {}", style("Redis URL:").green().italic(), redis_url);
  println!(
    "{} {}",
    style("Server Listening:").green().italic(),
    bind_addr
  );
  Server::builder()
    .add_service(BasicServer::new(Services::default()))
    .serve(bind_addr.parse().unwrap())
    .await?;
  Ok(())
}
