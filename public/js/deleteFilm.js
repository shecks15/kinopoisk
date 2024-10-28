function deleteFilms(id, authorID){
    axios.delete(`/api/films/${id}`).then(data => {
        if(data.status == 200){
            window.location.href = `/admin/${authorID}`
        }else if(data.status == 404){
            window.location.href = `/admin/${authorID}?error=404`
        }
    })
}